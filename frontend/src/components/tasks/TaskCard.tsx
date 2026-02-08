'use client';

import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types/task.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import Timer from '@/components/dashboard/Timer';
import { formatTime, formatDate, getPriorityColor, getStatusColor } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { deleteTask, toggleTask } = useTaskStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggle = async () => {
    try {
      await toggleTask(task.id);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('_', ' ')}
            </Badge>
          </div>
          
          {task.description && (
            <p className="text-gray-600 mb-3">{task.description}</p>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>Created: {formatDate(task.createdAt)}</span>
            {task.totalTime && task.totalTime > 0 && (
              <span>Time: {formatTime(task.totalTime)}</span>
            )}
            {task.category && (
              <span 
                className="px-2 py-1 rounded" 
                style={{ backgroundColor: task.category.color + '20', color: task.category.color }}
              >
                {task.category.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Timer taskId={task.id} />
          <div className="flex gap-2">
            <Button onClick={handleToggle} size="sm" variant="outline">
              {task.status === 'COMPLETED' ? 'Undo' : 'Complete'}
            </Button>
            <Button onClick={() => setIsEditOpen(true)} size="sm" variant="outline">
              Edit
            </Button>
            <Button 
              onClick={handleDelete} 
              size="sm" 
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm task={task} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}