'use client';

import { useTaskStore } from '@/store/taskStore';
import TaskCard from '@/components/tasks/TaskCard';

export default function TaskList() {
  const { tasks } = useTaskStore();
  const recentTasks = tasks.slice(0, 5);

  if (recentTasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Tasks</h2>
      <div className="space-y-3">
        {recentTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}