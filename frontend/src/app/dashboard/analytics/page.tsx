'use client';

import { useEffect, useState } from 'react';
import { useAnalyticsStore, TimeRange } from '@/store/analyticsStore';
import { useCategoryStore } from '@/store/categoryStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Calendar, Search, Filter, TrendingUp, Clock, CheckCircle, ListTodo, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TaskStatus, Priority } from '@/types/task.types';
import { Badge } from '@/components/ui/badge';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function AnalyticsPage() {
  const { data, loading, filters, setFilters, fetchAnalytics, exportCSV } = useAnalyticsStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnalytics();
    fetchCategories();
  }, [fetchAnalytics, fetchCategories]);

  // Filter tasks based on search
  const filteredTasks = data?.tasks?.filter((task: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower) ||
      task.category?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const exportPDF = async () => {
    if (!data) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Header with background
    doc.setFillColor(59, 130, 246); // Blue background
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Title in white
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Task Analytics Report', pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(11);
    doc.text(
      `${new Date(data.summary.dateRange.start).toLocaleDateString()} - ${new Date(data.summary.dateRange.end).toLocaleDateString()}`,
      pageWidth / 2,
      32,
      { align: 'center' }
    );
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Summary Stats Cards
    const cardY = 50;
    const cardWidth = 45;
    const cardHeight = 25;
    const gap = 5;
    
    // Card 1: Total Tasks
    doc.setFillColor(240, 242, 245);
    doc.roundedRect(10, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Total Tasks', 12, cardY + 8);
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(String(data.summary.totalTasks || 0), 12, cardY + 20);
    
    // Card 2: Completed
    const card2X = 10 + cardWidth + gap;
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(card2X, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Completed', card2X + 2, cardY + 8);
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text(String(data.summary.completedTasks || 0), card2X + 2, cardY + 20);
    
    // Card 3: Total Hours
    const card3X = card2X + cardWidth + gap;
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(card3X, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Total Hours', card3X + 2, cardY + 8);
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text(`${data.summary.totalHours || 0}h`, card3X + 2, cardY + 20);
    
    // Card 4: Avg Time
    const card4X = card3X + cardWidth + gap;
    doc.setFillColor(250, 245, 255);
    doc.roundedRect(card4X, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Avg/Task', card4X + 2, cardY + 8);
    doc.setFontSize(20);
    doc.setTextColor(168, 85, 247);
    doc.text(`${data.summary.avgTimePerTask || 0}h`, card4X + 2, cardY + 20);
    
    // Add Charts Section Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Analytics Charts', 14, 90);
    
    try {
      // Capture Bar Chart
      const barChartCanvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (barChartCanvas) {
        const barChartImg = barChartCanvas.toDataURL('image/png');
        doc.addImage(barChartImg, 'PNG', 10, 95, 90, 60);
      }
      
      // Capture Pie Chart (second canvas)
      const allCanvases = document.querySelectorAll('canvas');
      if (allCanvases.length > 1) {
        const pieChartCanvas = allCanvases[1] as HTMLCanvasElement;
        const pieChartImg = pieChartCanvas.toDataURL('image/png');
        doc.addImage(pieChartImg, 'PNG', 105, 95, 90, 60);
      }
      
      // Capture Line Chart (third canvas) on new page
      if (allCanvases.length > 2) {
        doc.addPage();
        
        // Header for charts page
        doc.setFillColor(59, 130, 246);
        doc.rect(0, 0, pageWidth, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text('Productivity Trend', pageWidth / 2, 16, { align: 'center' });
        
        doc.setTextColor(0, 0, 0);
        const lineChartCanvas = allCanvases[2] as HTMLCanvasElement;
        const lineChartImg = lineChartCanvas.toDataURL('image/png');
        doc.addImage(lineChartImg, 'PNG', 10, 30, pageWidth - 20, 80);
      }
    } catch (error) {
      console.error('Error capturing charts:', error);
      // Continue without charts if there's an error
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('Charts could not be captured', 14, 100);
    }
    
    // Tasks List
    doc.addPage();
    
    // Header for tasks page
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Task Details', pageWidth / 2, 16, { align: 'center' });
    
    // Task list
    doc.setTextColor(0, 0, 0);
    let yPosition = 35;
    
    filteredTasks.forEach((task: any, index: number) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Task card background
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(10, yPosition, pageWidth - 20, 32, 2, 2, 'F');
      
      // Task number and title
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${task.title}`, 14, yPosition + 8);
      
      // Task details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      
      // Category with color dot
      if (task.categoryColor) {
        const [r, g, b] = hexToRgb(task.categoryColor);
        doc.setFillColor(r, g, b);
        doc.circle(14, yPosition + 16, 1.5, 'F');
      }
      doc.text(`Category: ${task.category}`, 19, yPosition + 17);
      
      // Status badge
      const statusX = 70;
      doc.text(`Status: ${task.status.replace('_', ' ')}`, statusX, yPosition + 17);
      
      // Priority
      const priorityX = 120;
      let priorityColor: [number, number, number] = [100, 100, 100];
      if (task.priority === 'URGENT') priorityColor = [220, 38, 38];
      else if (task.priority === 'HIGH') priorityColor = [234, 88, 12];
      const [r, g, b] = priorityColor;
      doc.setTextColor(r, g, b);
      doc.text(`Priority: ${task.priority}`, priorityX, yPosition + 17);
      
      // Hours
      doc.setTextColor(59, 130, 246);
      doc.text(`${task.totalHours}h`, pageWidth - 30, yPosition + 17);
      
      // Description
      if (task.description) {
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(7);
        const desc = task.description.substring(0, 120) + (task.description.length > 120 ? '...' : '');
        doc.text(desc, 14, yPosition + 25);
      }
      
      // Created date
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(7);
      doc.text(`Created: ${new Date(task.createdAt).toLocaleDateString()}`, 14, yPosition + 30);
      
      yPosition += 38;
    });
    
    // Footer on last page
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} | Total Tasks: ${filteredTasks.length}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    
    doc.save(`analytics-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [100, 100, 100];
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Chart Data
  const pieChartData = {
    labels: data?.categoryDistribution?.map((item: any) => item.category) || [],
    datasets: [
      {
        label: 'Hours',
        data: data?.categoryDistribution?.map((item: any) => item.hours) || [],
        backgroundColor: data?.categoryDistribution?.map((item: any) => item.color) || [],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const barChartData = {
    labels: data?.dailyHours?.map((item: any) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Hours',
        data: data?.dailyHours?.map((item: any) => item.hours) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: data?.dailyHours?.map((item: any) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Productivity (Hours)',
        data: data?.dailyHours?.map((item: any) => item.hours) || [],
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgb(16, 185, 129)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Insights and data visualization of your tasks</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={exportCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={exportPDF} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Time Range */}
              <Select
                value={filters.timeRange}
                onValueChange={(value) => setFilters({ timeRange: value as TimeRange })}
              >
                <SelectTrigger className="w-35 h-10">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TimeRange.TODAY}>Today</SelectItem>
                  <SelectItem value={TimeRange.WEEK}>Last 7 Days</SelectItem>
                  <SelectItem value={TimeRange.MONTH}>Last 30 Days</SelectItem>
                  <SelectItem value={TimeRange.CUSTOM}>Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {/* Custom Date Range Popover */}
              {filters.timeRange === TimeRange.CUSTOM && (
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
                      {filters.startDate && filters.endDate
                        ? `${formatDateDisplay(filters.startDate)} - ${formatDateDisplay(filters.endDate)}`
                        : 'Select dates'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Custom Date Range</h4>
                        <p className="text-xs text-gray-500">
                          Select date range for analytics
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
                              onChange={(e) => setFilters({ startDate: e.target.value })}
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
                              onChange={(e) => setFilters({ endDate: e.target.value })}
                              min={filters.startDate || undefined}
                              className="h-9"
                            />
                          </div>
                        </div>

                        {(filters.startDate || filters.endDate) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilters({ startDate: '', endDate: '' })}
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
              )}

              {/* Category Filter */}
              <Select
                value={filters.categoryId || 'all'}
                onValueChange={(value) => setFilters({ categoryId: value === 'all' ? '' : value })}
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

              {/* Priority Filter */}
              <Select
                value={filters.priority || 'all'}
                onValueChange={(value) => setFilters({ priority: value === 'all' ? '' : value })}
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
            </div>
          </div>

          {/* Active Filters Bar */}
          {(filters.categoryId || filters.priority || (filters.timeRange === TimeRange.CUSTOM && (filters.startDate || filters.endDate))) && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs font-medium text-gray-600">Active filters:</span>
              
              {filters.categoryId && (
                <Badge variant="secondary" className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: categories.find(c => c.id === filters.categoryId)?.color }}
                  />
                  <span className="text-xs">{categories.find(c => c.id === filters.categoryId)?.name}</span>
                  <button
                    onClick={() => setFilters({ categoryId: '' })}
                    className="ml-0.5 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                    aria-label="Remove category filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.priority && (
                <Badge variant="secondary" className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1">
                  <span className="text-xs">Priority: {filters.priority}</span>
                  <button
                    onClick={() => setFilters({ priority: '' })}
                    className="ml-0.5 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                    aria-label="Remove priority filter"
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
                      ? `${formatDateDisplay(filters.startDate)} - ${formatDateDisplay(filters.endDate)}`
                      : filters.startDate
                      ? `From ${formatDateDisplay(filters.startDate)}`
                      : `To ${formatDateDisplay(filters.endDate)}`}
                  </span>
                  <button
                    onClick={() => setFilters({ startDate: '', endDate: '' })}
                    className="ml-0.5 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                    aria-label="Remove date filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {/* Clear All Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({
                    timeRange: TimeRange.WEEK,
                    categoryId: '',
                    priority: '',
                    startDate: '',
                    endDate: '',
                  });
                  setSearchTerm('');
                }}
                className="h-7 px-2.5 ml-auto text-xs"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary?.totalTasks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filters.timeRange === TimeRange.TODAY ? 'Today' : filters.timeRange === TimeRange.WEEK ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data?.summary?.completedTasks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(data?.summary?.totalTasks ?? 0) > 0
                ? `${Math.round(((data?.summary?.completedTasks ?? 0) / (data?.summary?.totalTasks ?? 1)) * 100)}% completion rate`
                : 'No tasks yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data?.summary?.totalHours || 0}h</div>
            <p className="text-xs text-muted-foreground mt-1">Time tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time/Task</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{data?.summary?.avgTimePerTask || 0}h</div>
            <p className="text-xs text-muted-foreground mt-1">Per task average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Top Row: Bar Chart (Left) and Pie Chart (Right) */}
      <div className="grid grid-cols-2 gap-6">
        {/* Daily Hours - Bar Chart (Top Left) */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              {(data?.dailyHours?.length ?? 0) > 0 ? (
                <Bar data={barChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Time by Category - Pie Chart (Top Right) */}
        <Card>
          <CardHeader>
            <CardTitle>Time by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              {(data?.categoryDistribution?.length ?? 0) > 0 ? (
                <Pie data={pieChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Trend - Line Chart (Bottom Full Width) */}
      <Card>
        <CardHeader>
          <CardTitle>Productivity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-75">
            {(data?.dailyHours?.length ?? 0) > 0 ? (
              <Line data={lineChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task Details</CardTitle>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Hours</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task: any) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: task.categoryColor || '#9CA3AF' }}
                          />
                          <span className="text-sm">{task.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            task.status === TaskStatus.COMPLETED
                              ? 'default'
                              : task.status === TaskStatus.IN_PROGRESS
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            task.priority === Priority.URGENT
                              ? 'destructive'
                              : task.priority === Priority.HIGH
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">{task.totalHours}h</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}