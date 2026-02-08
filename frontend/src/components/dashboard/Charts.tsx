'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Charts() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/analytics/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
        <div className="space-y-2">
          {stats.tasksByStatus?.map((item: any) => (
            <div key={item.status} className="flex justify-between">
              <span>{item.status}</span>
              <span className="font-semibold">{item._count.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
        <div className="space-y-2">
          {stats.tasksByPriority?.map((item: any) => (
            <div key={item.priority} className="flex justify-between">
              <span>{item.priority}</span>
              <span className="font-semibold">{item._count.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}