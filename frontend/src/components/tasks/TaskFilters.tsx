'use client';

import { useEffect, useState } from 'react';
import { useCategoryStore } from '@/store/categoryStore';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TaskStatus, Priority } from '@/types/task.types';
import { Calendar, Filter, X, Search, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskFiltersProps {
  filters: {
    status: TaskStatus | '';
    priority: Priority | '';
    categoryId: string;
    search: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const clearFilters = () => {
    onFilterChange({
      status: '',
      priority: '',
      categoryId: '',
      search: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    });
  };



  const activeFiltersCount = [
    filters.status,
    filters.priority,
    filters.categoryId,
    filters.startDate,
    filters.endDate,
    filters.startTime,
    filters.endTime,
  ].filter(Boolean).length;

  const selectedCategory = categories.find(cat => cat.id === filters.categoryId);

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format time for display (12-hour format)
  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };


  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Main Filter Bar */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-10 h-10"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Status Filter */}
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => onFilterChange({ ...filters, status: value === 'all' ? '' : value })}
            >
              <SelectTrigger className="w-35 h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={filters.priority || 'all'}
              onValueChange={(value) => onFilterChange({ ...filters, priority: value === 'all' ? '' : value })}
            >
              <SelectTrigger className="w-32.5 h-10">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value={Priority.LOW}>Low</SelectItem>
                <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={Priority.HIGH}>High</SelectItem>
                <SelectItem value={Priority.URGENT}>Urgent</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={filters.categoryId || 'all'}
              onValueChange={(value) => onFilterChange({ ...filters, categoryId: value === 'all' ? '' : value })}
            >
              <SelectTrigger className="w-37.5 h-10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="truncate">{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`h-10 w-42.5 justify-start ${
                    filters.startDate || filters.endDate
                      ? 'border-primary text-primary' 
                      : ''
                  }`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.startDate || filters.endDate ? (
                    <span className="text-xs truncate">
                      {filters.startDate && filters.endDate
                        ? `${formatDateDisplay(filters.startDate)} - ${formatDateDisplay(filters.endDate)}`
                        : filters.startDate
                        ? `From ${formatDateDisplay(filters.startDate)}`
                        : `To ${formatDateDisplay(filters.endDate)}`}
                    </span>
                  ) : (
                    <span className="text-xs">Created Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Filter by Created Date</h4>
                    <p className="text-xs text-gray-500">
                      Select date range for when tasks were created
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={filters.startDate}
                          onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
                          max={filters.endDate || undefined}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={filters.endDate}
                          onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
                          min={filters.startDate || undefined}
                          className="h-9"
                        />
                      </div>
                    </div>

                    {/* Quick Date Presets */}
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-gray-700 mb-2">Quick Select</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const today = new Date().toISOString().split('T')[0];
                            onFilterChange({ ...filters, startDate: today, endDate: today });
                          }}
                        >
                          Today
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const today = new Date();
                            const yesterday = new Date(today);
                            yesterday.setDate(yesterday.getDate() - 1);
                            const dateStr = yesterday.toISOString().split('T')[0];
                            onFilterChange({ ...filters, startDate: dateStr, endDate: dateStr });
                          }}
                        >
                          Yesterday
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const today = new Date();
                            const lastWeek = new Date(today);
                            lastWeek.setDate(lastWeek.getDate() - 7);
                            onFilterChange({
                              ...filters,
                              startDate: lastWeek.toISOString().split('T')[0],
                              endDate: today.toISOString().split('T')[0],
                            });
                          }}
                        >
                          Last 7 Days
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const today = new Date();
                            const lastMonth = new Date(today);
                            lastMonth.setDate(lastMonth.getDate() - 30);
                            onFilterChange({
                              ...filters,
                              startDate: lastMonth.toISOString().split('T')[0],
                              endDate: today.toISOString().split('T')[0],
                            });
                          }}
                        >
                          Last 30 Days
                        </Button>
                      </div>
                    </div>
                    
                    {(filters.startDate || filters.endDate) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFilterChange({ ...filters, startDate: '', endDate: '' })}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear Date Range
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Time Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`h-10 w-40 justify-start ${
                    filters.startTime || filters.endTime
                      ? 'border-primary text-primary' 
                      : ''
                  }`}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {filters.startTime || filters.endTime ? (
                    <span className="text-xs truncate">
                      {filters.startTime && filters.endTime
                        ? `${formatTimeDisplay(filters.startTime)} - ${formatTimeDisplay(filters.endTime)}`
                        : filters.startTime
                        ? `From ${formatTimeDisplay(filters.startTime)}`
                        : `To ${formatTimeDisplay(filters.endTime)}`}
                    </span>
                  ) : (
                    <span className="text-xs">Created Time</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Filter by Created Time</h4>
                    <p className="text-xs text-gray-500">
                      Select time range for when tasks were created
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          Start Time
                        </label>
                        <Input
                          type="time"
                          value={filters.startTime}
                          onChange={(e) => onFilterChange({ ...filters, startTime: e.target.value })}
                          max={filters.endTime || undefined}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          End Time
                        </label>
                        <Input
                          type="time"
                          value={filters.endTime}
                          onChange={(e) => onFilterChange({ ...filters, endTime: e.target.value })}
                          min={filters.startTime || undefined}
                          className="h-9"
                        />
                      </div>
                    </div>

                    {/* Quick Time Presets */}
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-gray-700 mb-2">Quick Select</p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onFilterChange({ ...filters, startTime: '00:00', endTime: '08:00' });
                          }}
                        >
                          Night
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onFilterChange({ ...filters, startTime: '08:00', endTime: '17:00' });
                          }}
                        >
                          Work Hours
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onFilterChange({ ...filters, startTime: '17:00', endTime: '23:59' });
                          }}
                        >
                          Evening
                        </Button>
                      </div>
                    </div>
                    
                    {(filters.startTime || filters.endTime) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFilterChange({ ...filters, startTime: '', endTime: '' })}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear Time Range
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-200">
            <span className="text-xs font-medium text-gray-600">Active filters:</span>
            
            {filters.status && (
              <Badge variant="secondary" className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1">
                <span className="text-xs">Status: {filters.status.replace('_', ' ')}</span>
                <button
                  onClick={() => onFilterChange({ ...filters, status: '' })}
                  className="ml-0.5 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                  aria-label="Remove status filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filters.priority && (
              <Badge variant="secondary" className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1">
                <span className="text-xs">Priority: {filters.priority}</span>
                <button
                  onClick={() => onFilterChange({ ...filters, priority: '' })}
                  className="ml-0.5 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                  aria-label="Remove priority filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                <span className="text-xs">{selectedCategory.name}</span>
                <button
                  onClick={() => onFilterChange({ ...filters, categoryId: '' })}
                  className="ml-0.5 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                  aria-label="Remove category filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {(filters.startDate || filters.endDate) && (
              <Badge variant="secondary" className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {filters.startDate && filters.endDate
                    ? filters.startDate === filters.endDate
                      ? formatDateDisplay(filters.startDate)
                      : `${formatDateDisplay(filters.startDate)} - ${formatDateDisplay(filters.endDate)}`
                    : filters.startDate
                    ? `From ${formatDateDisplay(filters.startDate)}`
                    : `To ${formatDateDisplay(filters.endDate)}`}
                </span>
                <button
                  onClick={() => onFilterChange({ ...filters, startDate: '', endDate: '' })}
                  className="ml-0.5 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                  aria-label="Remove date filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(filters.startTime || filters.endTime) && (
              <Badge variant="secondary" className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">
                  {filters.startTime && filters.endTime
                    ? `${formatTimeDisplay(filters.startTime)} - ${formatTimeDisplay(filters.endTime)}`
                    : filters.startTime
                    ? `From ${formatTimeDisplay(filters.startTime)}`
                    : `To ${formatTimeDisplay(filters.endTime)}`}
                </span>
                <button
                  onClick={() => onFilterChange({ ...filters, startTime: '', endTime: '' })}
                  className="ml-0.5 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                  aria-label="Remove time filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Clear All Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2.5 ml-auto text-xs"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}