'use client';

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ completed, total, label }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          {label || "Today's Progress"}
        </span>
        <span className="text-sm font-semibold text-gray-900">
          {completed}/{total} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full w-full bg-linear-to-r from-transparent to-white/20" />
        </div>
      </div>
    </div>
  );
}