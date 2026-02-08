import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimeEntriesService {
  constructor(private prisma: PrismaService) {}

  async startTimer(taskId: string, userId: string) {
    // Check if task exists and belongs to user
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    // Check if there's already an active timer
    const activeTimer = await this.prisma.timeEntry.findFirst({
      where: {
        userId,
        endTime: null,
      },
    });

    if (activeTimer) {
      throw new BadRequestException('You already have an active timer');
    }

    // Create new time entry
    return this.prisma.timeEntry.create({
      data: {
        taskId,
        userId,
        startTime: new Date(),
      },
      include: {
        task: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async stopTimer(entryId: string, userId: string) {
    const entry = await this.prisma.timeEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry || entry.userId !== userId) {
      throw new NotFoundException('Time entry not found');
    }

    if (entry.endTime) {
      throw new BadRequestException('Timer already stopped');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - entry.startTime.getTime()) / 1000);

    return this.prisma.timeEntry.update({
      where: { id: entryId },
      data: {
        endTime,
        duration,
      },
      include: {
        task: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async getActiveTimer(userId: string) {
    return this.prisma.timeEntry.findFirst({
      where: {
        userId,
        endTime: null,
      },
      include: {
        task: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async getTaskTimeEntries(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.timeEntry.findMany({
      where: { taskId },
      orderBy: { startTime: 'desc' },
    });
  }
}