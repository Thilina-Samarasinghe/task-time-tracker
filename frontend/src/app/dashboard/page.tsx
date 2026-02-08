'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/store/taskStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { TimeFilter } from '@/types/dashboard.types';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import RecentTasks from '@/components/dashboard/RecentTasks';
import { TaskStatus } from '@/types/task.types';

export default function DashboardPage() {
  const router = useRouter();
  const { tasks, fetchTasks } = useTaskStore();
  const { timeFilter, stats, loading, setTimeFilter, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // Filter tasks based on time filter
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const now = new Date();
    
    if (timeFilter === TimeFilter.TODAY) {
      return taskDate.toDateString() === now.toDateString();
    } else {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return taskDate >= weekAgo;
    }
  });

  // Today's tasks for progress bar (always today, regardless of filter)
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate.toDateString() === new Date().toDateString();
  });
  const todayCompleted = todayTasks.filter(t => t.status === TaskStatus.COMPLETED).length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your tasks and productivity</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Analytics Button */}
          <button
            onClick={() => router.push('/dashboard/analytics')}
            className="px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>📊</span>
            Analytics Dashboard
          </button>

          {/* Time Filter Dropdown */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option value={TimeFilter.TODAY}>Today</option>
            <option value={TimeFilter.WEEKLY}>Weekly</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title={timeFilter === TimeFilter.TODAY ? "Total Tasks Today" : "Total Tasks This Week"}
            value={stats?.totalTasks || filteredTasks.length}
            icon="📋"
            color="blue"
            subtitle={timeFilter === TimeFilter.WEEKLY ? "Last 7 days" : undefined}
          />
          <StatsCard
            title={timeFilter === TimeFilter.TODAY ? "Completed Today" : "Completed This Week"}
            value={stats?.completedTasks || filteredTasks.filter(t => t.status === TaskStatus.COMPLETED).length}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="Hours Tracked Today"
            value={stats?.hoursTrackedToday ? stats.hoursTrackedToday.toFixed(1) : '0.0'}
            icon="⏱️"
            color="purple"
            subtitle="Current day"
          />
          <StatsCard
            title="Hours Tracked This Week"
            value={stats?.hoursTrackedWeek ? stats.hoursTrackedWeek.toFixed(1) : '0.0'}
            icon="📈"
            color="indigo"
            subtitle="Last 7 days"
          />
        </div>
      )}

      {/* Today's Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ProgressBar
          completed={todayCompleted}
          total={todayTasks.length}
          label="Today's Task Completion"
        />
      </div>

      {/* Recent Tasks */}
      <RecentTasks tasks={filteredTasks} timeFilter={timeFilter} />
    </div>
  );
}