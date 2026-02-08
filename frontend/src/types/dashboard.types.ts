export enum TimeFilter {
  TODAY = 'TODAY',
  WEEKLY = 'WEEKLY'
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgress: number;
  todo: number;
  hoursTrackedToday: number;
  hoursTrackedWeek: number;
  completedThisWeek: number;
  todayProgress: number; // Percentage of completed tasks today
}

export interface DashboardFilters {
  timeFilter: TimeFilter;
}