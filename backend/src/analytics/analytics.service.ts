import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

export enum TimeRange {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  CUSTOM = 'custom'
}

interface AnalyticsQuery {
  timeRange?: TimeRange;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  priority?: string;
  status?: string;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Existing method - Dashboard stats
  async getDashboardStats(userId: string, filter: 'today' | 'weekly' = 'today') {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const dateFilter = filter === 'today' ? startOfDay : startOfWeek;

    const [
      totalTasks,
      completedTasks,
      inProgress,
      todo,
      todayTimeEntries,
      weekTimeEntries,
    ] = await Promise.all([
      // Total tasks based on filter
      this.prisma.task.count({
        where: { userId, createdAt: { gte: dateFilter } },
      }),
      
      // Completed tasks based on filter
      this.prisma.task.count({
        where: { 
          userId, 
          status: TaskStatus.COMPLETED, 
          createdAt: { gte: dateFilter } 
        },
      }),
      
      // In progress tasks based on filter
      this.prisma.task.count({
        where: { 
          userId, 
          status: TaskStatus.IN_PROGRESS, 
          createdAt: { gte: dateFilter } 
        },
      }),
      
      // Todo tasks based on filter
      this.prisma.task.count({
        where: { 
          userId, 
          status: TaskStatus.TODO, 
          createdAt: { gte: dateFilter } 
        },
      }),
      
      // Today's time entries (always today)
      this.prisma.timeEntry.aggregate({
        where: {
          userId,
          startTime: { gte: startOfDay },
        },
        _sum: { duration: true },
      }),
      
      // This week's time entries (always weekly)
      this.prisma.timeEntry.aggregate({
        where: {
          userId,
          startTime: { gte: startOfWeek },
        },
        _sum: { duration: true },
      }),
    ]);

    // Calculate hours from seconds
    const hoursTrackedToday = (todayTimeEntries._sum.duration || 0) / 3600;
    const hoursTrackedWeek = (weekTimeEntries._sum.duration || 0) / 3600;

    return {
      totalTasks,
      completedTasks,
      inProgress,
      todo,
      hoursTrackedToday: Number(hoursTrackedToday.toFixed(2)),
      hoursTrackedWeek: Number(hoursTrackedWeek.toFixed(2)),
      completedThisWeek: completedTasks,
    };
  }

  // Existing method - Time tracked
  async getTimeTracked(userId: string, filter: 'today' | 'weekly' = 'today') {
    const now = new Date();
    const startDate = filter === 'today' 
      ? new Date(now.setHours(0, 0, 0, 0))
      : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const result = await this.prisma.timeEntry.aggregate({
      where: {
        userId,
        startTime: { gte: startDate },
      },
      _sum: { duration: true },
      _count: true,
    });

    const totalHours = (result._sum.duration || 0) / 3600;

    return {
      totalHours: Number(totalHours.toFixed(2)),
      entries: result._count,
      filter,
    };
  }

  // Existing method - Dashboard
  async getDashboard(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      tasksCompletedToday,
      tasksCompletedWeek,
      timeEntriesToday,
      timeEntriesWeek,
      tasksByStatus,
      tasksByPriority,
    ] = await Promise.all([
      this.prisma.task.count({
        where: {
          userId,
          status: TaskStatus.COMPLETED,
          updatedAt: { gte: today },
        },
      }),
      this.prisma.task.count({
        where: {
          userId,
          status: TaskStatus.COMPLETED,
          updatedAt: { gte: weekAgo },
        },
      }),
      this.prisma.timeEntry.aggregate({
        where: {
          userId,
          startTime: { gte: today },
        },
        _sum: { duration: true },
      }),
      this.prisma.timeEntry.aggregate({
        where: {
          userId,
          startTime: { gte: weekAgo },
        },
        _sum: { duration: true },
      }),
      this.prisma.task.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
      }),
      this.prisma.task.groupBy({
        by: ['priority'],
        where: { userId },
        _count: { priority: true },
      }),
    ]);

    return {
      tasksCompletedToday,
      tasksCompletedWeek,
      totalHoursToday: (timeEntriesToday._sum.duration || 0) / 3600,
      totalHoursWeek: (timeEntriesWeek._sum.duration || 0) / 3600,
      tasksByStatus,
      tasksByPriority,
    };
  }

  // Existing method - Productivity trend
  async getProductivityTrend(userId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        status: TaskStatus.COMPLETED,
        updatedAt: { gte: startDate },
      },
      select: {
        updatedAt: true,
      },
    });

    const timeEntries = await this.prisma.timeEntry.findMany({
      where: {
        userId,
        startTime: { gte: startDate },
      },
      select: {
        startTime: true,
        duration: true,
      },
    });

    const trendData: any[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const tasksCompleted = tasks.filter(
        (t) => t.updatedAt >= date && t.updatedAt < nextDate
      ).length;

      const hoursTracked = timeEntries
        .filter((e) => e.startTime >= date && e.startTime < nextDate)
        .reduce((sum, e) => sum + e.duration, 0) / 3600;

      trendData.push({
        date: date.toISOString().split('T')[0],
        tasksCompleted,
        hoursTracked: Number(hoursTracked.toFixed(2)),
      });
    }

    return trendData;
  }

  // Existing method - Time distribution
  async getTimeDistribution(userId: string, period: 'week' | 'month' = 'week') {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (period === 'week' ? 7 : 30));
    startDate.setHours(0, 0, 0, 0);

    const categories = await this.prisma.category.findMany({
      where: { userId },
      include: {
        tasks: {
          include: {
            timeEntries: {
              where: {
                startTime: { gte: startDate },
              },
            },
          },
        },
      },
    });

    return categories.map((category) => {
      const totalHours = category.tasks.reduce(
        (sum, task) =>
          sum + task.timeEntries.reduce((s, e) => s + e.duration, 0) / 3600,
        0
      );

      return {
        name: category.name,
        hours: Number(totalHours.toFixed(2)),
        color: category.color,
      };
    });
  }

  // NEW METHOD - Get comprehensive analytics
  async getAnalytics(userId: string, query: AnalyticsQuery) {
    const { start, end } = this.getDateRange(
      query.timeRange || TimeRange.TODAY,
      query.startDate,
      query.endDate
    );

    const whereClause: any = {
      userId,
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    if (query.categoryId) {
      whereClause.categoryId = query.categoryId;
    }

    if (query.priority) {
      whereClause.priority = query.priority;
    }

    if (query.status) {
      whereClause.status = query.status;
    }

    // Get tasks with time entries
    const tasks = await this.prisma.task.findMany({
      where: whereClause,
      include: {
        timeEntries: {
          where: {
            endTime: { not: null },
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate time per task
    const timePerTask = tasks.map(task => {
      const totalMinutes = task.timeEntries.reduce((sum, entry) => {
        if (entry.endTime) {
          const duration = new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime();
          return sum + duration / (1000 * 60);
        }
        return sum;
      }, 0);

      return {
        id: task.id,
        title: task.title,
        minutes: Math.round(totalMinutes),
        hours: parseFloat((totalMinutes / 60).toFixed(2)),
        category: task.category?.name || 'Uncategorized',
        categoryColor: task.category?.color || '#9CA3AF',
        priority: task.priority,
        status: task.status,
      };
    });

    // Calculate daily hours
    const dailyHoursMap = new Map<string, number>();
    
    tasks.forEach(task => {
      task.timeEntries.forEach(entry => {
        if (entry.endTime) {
          const date = new Date(entry.startTime).toISOString().split('T')[0];
          const duration = new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime();
          const hours = duration / (1000 * 60 * 60);
          
          dailyHoursMap.set(date, (dailyHoursMap.get(date) || 0) + hours);
        }
      });
    });

    const dailyHours = Array.from(dailyHoursMap.entries())
      .map(([date, hours]) => ({
        date,
        hours: parseFloat(hours.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate category distribution
    const categoryMap = new Map<string, { name: string; minutes: number; color: string }>();
    
    tasks.forEach(task => {
      const categoryName = task.category?.name || 'Uncategorized';
      const categoryColor = task.category?.color || '#9CA3AF';
      
      const totalMinutes = task.timeEntries.reduce((sum, entry) => {
        if (entry.endTime) {
          const duration = new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime();
          return sum + duration / (1000 * 60);
        }
        return sum;
      }, 0);

      const existing = categoryMap.get(categoryName);
      if (existing) {
        existing.minutes += totalMinutes;
      } else {
        categoryMap.set(categoryName, { name: categoryName, minutes: totalMinutes, color: categoryColor });
      }
    });

    const categoryDistribution = Array.from(categoryMap.values()).map(cat => ({
      category: cat.name,
      minutes: Math.round(cat.minutes),
      hours: parseFloat((cat.minutes / 60).toFixed(2)),
      color: cat.color,
    }));

    // Calculate summary stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const totalMinutes = timePerTask.reduce((sum, t) => sum + t.minutes, 0);
    const totalHours = parseFloat((totalMinutes / 60).toFixed(2));
    const avgTimePerTask = totalTasks > 0 ? parseFloat((totalMinutes / totalTasks / 60).toFixed(2)) : 0;

    return {
      summary: {
        totalTasks,
        completedTasks,
        totalHours,
        avgTimePerTask,
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
      timePerTask: timePerTask.sort((a, b) => b.minutes - a.minutes),
      dailyHours,
      categoryDistribution: categoryDistribution.sort((a, b) => b.minutes - a.minutes),
      tasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        category: task.category?.name || 'Uncategorized',
        categoryColor: task.category?.color || '#9CA3AF',
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        totalHours: timePerTask.find(t => t.id === task.id)?.hours || 0,
      })),
    };
  }

  // NEW METHOD - Export tasks as CSV
  async exportTasksCSV(userId: string, query: AnalyticsQuery): Promise<string> {
    const analytics = await this.getAnalytics(userId, query);
    
    const headers = ['Title', 'Description', 'Category', 'Status', 'Priority', 'Hours Tracked', 'Created At', 'Updated At'];
    const rows = analytics.tasks.map(task => [
      task.title,
      task.description || '',
      task.category,
      task.status,
      task.priority,
      task.totalHours.toString(),
      new Date(task.createdAt).toLocaleString(),
      new Date(task.updatedAt).toLocaleString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }

  // Helper method to get date range
  private getDateRange(timeRange: TimeRange, startDate?: string, endDate?: string) {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now.setHours(23, 59, 59, 999));

    switch (timeRange) {
      case TimeRange.TODAY:
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;
      case TimeRange.WEEK:
        start = new Date();
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case TimeRange.MONTH:
        start = new Date();
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        break;
      case TimeRange.CUSTOM:
        start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 7));
        end = endDate ? new Date(endDate) : new Date();
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start = new Date(now.setHours(0, 0, 0, 0));
    }

    return { start, end };
  }
}