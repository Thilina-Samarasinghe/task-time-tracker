import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus, Priority } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description || null,
        priority: createTaskDto.priority || Priority.MEDIUM,
        categoryId: createTaskDto.categoryId || null,
        userId,
      },
      include: {
        category: true,
        timeEntries: true,
      },
    });
  }

  async findAll(userId: string, filters?: {
    status?: TaskStatus;
    priority?: Priority;
    categoryId?: string;
    search?: string;
  }) {
    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        category: true,
        timeEntries: {
          select: {
            duration: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks.map(task => ({
      ...task,
      totalTime: task.timeEntries.reduce((sum, entry) => sum + entry.duration, 0),
    }));
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        category: true,
        timeEntries: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const totalTime = task.timeEntries.reduce((sum, entry) => sum + entry.duration, 0);

    return {
      ...task,
      totalTime,
    };
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        category: true,
        timeEntries: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async toggleStatus(id: string, userId: string) {
    const task = await this.findOne(id, userId);

    const newStatus = task.status === TaskStatus.COMPLETED 
      ? TaskStatus.TODO 
      : TaskStatus.COMPLETED;

    return this.prisma.task.update({
      where: { id },
      data: { status: newStatus },
      include: {
        category: true,
        timeEntries: true,
      },
    });
  }
}