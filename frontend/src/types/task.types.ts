export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export interface TimeEntry {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  taskId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  categoryId: string | null;
  category: Category | null;
  timeEntries: TimeEntry[];
  totalTime?: number;
  createdAt: string;
  updatedAt: string;
}