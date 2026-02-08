'use client';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'gray' | 'purple' | 'indigo';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-600',
  green: 'bg-green-50 border-green-200 text-green-600',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
  gray: 'bg-gray-50 border-gray-200 text-gray-600',
  purple: 'bg-purple-50 border-purple-200 text-purple-600',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
};

const iconBgClasses = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  yellow: 'bg-yellow-100',
  gray: 'bg-gray-100',
  purple: 'bg-purple-100',
  indigo: 'bg-indigo-100',
};

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle, 
  trend 
}: StatsCardProps) {
  return (
    <div 
      className={`rounded-xl border-2 ${colorClasses[color]} p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">
              {value}
            </p>
            {trend && (
              <span 
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div 
          className={`${iconBgClasses[color]} rounded-lg p-3 flex items-center justify-center`}
        >
          <span className="text-2xl">
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}