'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTaskStore } from '@/store/taskStore';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import TaskFilters from '@/components/tasks/TaskFilters';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TaskStatus, Priority } from '@/types/task.types';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, isToday, isYesterday } from 'date-fns';

export default function TasksPage() {
  const { tasks, fetchTasks } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '' as TaskStatus | '',
    priority: '' as Priority | '',
    categoryId: '',
    search: '',
    startDate: '',
    endDate: '',
    startTime: '',  
    endTime: '',    
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredAndGroupedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply status filter
    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      result = result.filter(t => t.priority === filters.priority);
    }

    // Apply category filter
    if (filters.categoryId) {
      result = result.filter(t => t.categoryId === filters.categoryId);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.category?.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply date filter
    if (filters.startDate || filters.endDate) {
      result = result.filter(t => {
        const taskDate = parseISO(t.createdAt);
        
        if (filters.startDate && filters.endDate) {
          return isWithinInterval(taskDate, {
            start: startOfDay(parseISO(filters.startDate)),
            end: endOfDay(parseISO(filters.endDate)),
          });
        } else if (filters.startDate) {
          return taskDate >= startOfDay(parseISO(filters.startDate));
        } else if (filters.endDate) {
          return taskDate <= endOfDay(parseISO(filters.endDate));
        }
        return true;
      });
    }

    // Apply time filter
    if (filters.startTime || filters.endTime) {
      result = result.filter(t => {
        const taskDateTime = parseISO(t.createdAt);
        const taskTime = format(taskDateTime, 'HH:mm'); // Get time in HH:mm format
        
        if (filters.startTime && filters.endTime) {
          return taskTime >= filters.startTime && taskTime <= filters.endTime;
        } else if (filters.startTime) {
          return taskTime >= filters.startTime;
        } else if (filters.endTime) {
          return taskTime <= filters.endTime;
        }
        return true;
      });
    }
    
    // Group by date (most recent first)
    const grouped: { [key: string]: typeof tasks } = {};
    
    result.forEach(task => {
      const date = format(parseISO(task.createdAt), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });

    // Sort dates descending and tasks within each date by creation time descending
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    
    sortedDates.forEach(date => {
      grouped[date].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    return { grouped, dates: sortedDates, totalCount: result.length };
  }, [tasks, filters]);

  const formatDateHeader = (dateStr: string) => {
    const date = parseISO(dateStr);

    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">
            {filteredAndGroupedTasks.totalCount} {filteredAndGroupedTasks.totalCount === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">+ New Task</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Section */}
      <TaskFilters filters={filters} onFilterChange={setFilters} />

      {/* Tasks List Section */}
      <div className="space-y-8">
        {filteredAndGroupedTasks.dates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow border border-gray-200">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-6">
                {tasks.length === 0 
                  ? "Get started by creating your first task!" 
                  : "Try adjusting your filters to see more tasks."}
              </p>
              {tasks.length === 0 && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  Create Your First Task
                </Button>
              )}
            </div>
          </div>
        ) : (
          filteredAndGroupedTasks.dates.map(date => (
            <div key={date} className="space-y-4">
              {/* Date Header - Sticky */}
              <div className="sticky top-0 bg-gray-50 py-3 z-10 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  {formatDateHeader(date)}
                  <span className="text-sm font-normal text-gray-500">
                    ({filteredAndGroupedTasks.grouped[date].length} {filteredAndGroupedTasks.grouped[date].length === 1 ? 'task' : 'tasks'})
                  </span>
                </h2>
              </div>
              
              {/* Tasks Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredAndGroupedTasks.grouped[date].map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}