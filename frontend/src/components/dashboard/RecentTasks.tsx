'use client';

import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task, TaskStatus, Priority } from '@/types/task.types';

interface RecentTasksProps {
  tasks: Task[];
  timeFilter: 'TODAY' | 'WEEKLY';
}

const statusConfig = {
  [TaskStatus.TODO]: { 
    color: 'bg-gray-100 text-gray-700 border-gray-300', 
    label: 'To Do',
    icon: '○',
  },
  [TaskStatus.IN_PROGRESS]: { 
    color: 'bg-blue-100 text-blue-700 border-blue-300', 
    label: 'In Progress',
    icon: '⟳',
  },
  [TaskStatus.COMPLETED]: { 
    color: 'bg-green-100 text-green-700 border-green-300', 
    label: 'Completed',
    icon: '✓',
  },
};

const priorityConfig: Record<Priority, { color: string; bg: string; label: string; icon: string }> = {
  [Priority.LOW]: {
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    label: 'Low',
    icon: '↓',
  },
  [Priority.MEDIUM]: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    label: 'Medium',
    icon: '→',
  },
  [Priority.HIGH]: {
    color: 'text-red-600',
    bg: 'bg-red-100',
    label: 'High',
    icon: '↑',
  },
  [Priority.URGENT]: {
    color: 'text-rose-700',
    bg: 'bg-rose-100',
    label: 'Urgent',
    icon: '‼️',
  },
};

function calculateTotalTime(task: Task): number {
  if (!task.timeEntries || task.timeEntries.length === 0) return 0;
  // Duration is stored in seconds in the database
  return task.timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours === 0 && minutes === 0) return '0m';
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function formatCreatedDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function RecentTasks({ tasks, timeFilter }: RecentTasksProps) {
  const { updateTask, deleteTask } = useTaskStore();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);

  // Sort all tasks by most recent update
  const sortedTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleToggleStatus = async (task: Task) => {
    setTogglingTaskId(task.id);
    try {
      const newStatus = task.status === TaskStatus.COMPLETED 
        ? TaskStatus.IN_PROGRESS 
        : TaskStatus.COMPLETED;
      
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    } finally {
      setTogglingTaskId(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setDeletingTaskId(taskId);
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setDeletingTaskId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {timeFilter === 'WEEKLY' ? 'All Tasks This Week' : 'All Tasks Today'}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
          </span>
          {sortedTasks.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {timeFilter === 'WEEKLY' ? 'Weekly View' : 'Today View'}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 font-medium text-lg">No tasks yet</p>
            <p className="text-gray-400 text-sm mt-1">
              {timeFilter === 'WEEKLY' 
                ? 'No tasks have been created this week' 
                : 'No tasks have been created today'}
            </p>
          </div>
        ) : (
          <>
            {/* Task Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {sortedTasks.filter(t => t.status === TaskStatus.TODO).length}
                </div>
                <div className="text-xs text-gray-600">To Do</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {sortedTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length}
                </div>
                <div className="text-xs text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sortedTasks.filter(t => t.status === TaskStatus.COMPLETED).length}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
            </div>

            {/* All Tasks */}
            {sortedTasks.map((task) => {
              const totalTimeSeconds = calculateTotalTime(task);
              const isDeleting = deletingTaskId === task.id;
              const isToggling = togglingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className="group bg-linear-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  {/* Header Row */}
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-10 h-10 rounded-lg ${statusConfig[task.status].color.split(' ')[0]} flex items-center justify-center border-2 ${statusConfig[task.status].color.split(' ')[2]} text-lg font-bold`}>
                        {statusConfig[task.status].icon}
                      </div>
                    </div>

                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      {/* Title and Priority */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </h3>
                        
                        {/* Priority Badge */}
                        <div className={`shrink-0 px-2 py-1 rounded-md ${priorityConfig[task.priority].bg} flex items-center gap-1`}>
                          <span className={`text-sm ${priorityConfig[task.priority].color}`}>
                            {priorityConfig[task.priority].icon}
                          </span>
                          <span className={`text-xs font-semibold ${priorityConfig[task.priority].color}`}>
                            {priorityConfig[task.priority].label}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                        {/* Status */}
                        <span className={`px-2.5 py-1 rounded-full font-medium border ${statusConfig[task.status].color}`}>
                          {statusConfig[task.status].label}
                        </span>

                        {/* Category */}
                        {task.category && (
                          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-gray-200">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: task.category.color }}
                            />
                            <span className="font-medium text-gray-700">{task.category.name}</span>
                          </span>
                        )}

                        {/* Time Spent - PROMINENT DISPLAY */}
                        <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full border-2 border-purple-200 font-semibold">
                          <span className="text-base">⏱️</span>
                          <span className="text-sm">{formatDuration(totalTimeSeconds)} spent</span>
                        </span>

                        {/* Created Date */}
                        <span className="flex items-center gap-1 text-gray-500 ml-auto">
                          <span>📅</span>
                          <span>{formatCreatedDate(task.createdAt)}</span>
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(task)}
                          disabled={isToggling}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            task.status === TaskStatus.COMPLETED
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300'
                              : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                          } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isToggling ? '...' : task.status === TaskStatus.COMPLETED ? '↩️ Undo' : '✓ Complete'}
                        </button>

                        <button
                          onClick={() => handleDelete(task.id)}
                          disabled={isDeleting}
                          className={`px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-medium border border-red-300 transition-all ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isDeleting ? 'Deleting...' : '🗑️ Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Footer Summary */}
      {sortedTasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          Showing all {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''} {timeFilter === 'WEEKLY' ? 'from this week' : 'from today'}
        </div>
      )}
    </div>
  );
}