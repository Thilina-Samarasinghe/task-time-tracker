import { Controller, Get, Query, UseGuards, Request, Res, Header } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Existing dashboard stats endpoint with filter
  @Get('dashboard-stats')
  getDashboardStats(
    @Request() req,
    @Query('filter') filter?: 'today' | 'weekly',
  ) {
    return this.analyticsService.getDashboardStats(
      req.user.id,
      filter || 'today',
    );
  }

  // Existing time tracked endpoint
  @Get('time-tracked')
  getTimeTracked(
    @Request() req,
    @Query('filter') filter?: 'today' | 'weekly',
  ) {
    return this.analyticsService.getTimeTracked(
      req.user.id,
      filter || 'today',
    );
  }

  // Existing dashboard endpoint (kept for backward compatibility)
  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.analyticsService.getDashboard(req.user.id);
  }

  // Existing productivity trend endpoint
  @Get('productivity-trend')
  getProductivityTrend(
    @Request() req,
    @Query('days') days?: string,
  ) {
    const numDays = days ? parseInt(days, 10) : 7;
    return this.analyticsService.getProductivityTrend(req.user.id, numDays);
  }

  // Existing time distribution endpoint
  @Get('time-distribution')
  getTimeDistribution(
    @Request() req,
    @Query('period') period?: 'week' | 'month',
  ) {
    return this.analyticsService.getTimeDistribution(req.user.id, period || 'week');
  }

  // NEW ENDPOINT - Get comprehensive analytics with filters
  @Get()
  async getAnalytics(
    @Request() req,
    @Query('timeRange') timeRange?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
    @Query('priority') priority?: string,
    @Query('status') status?: string,
  ) {
    return this.analyticsService.getAnalytics(req.user.id, {
      timeRange: timeRange as any,
      startDate,
      endDate,
      categoryId,
      priority,
      status,
    });
  }

  // NEW ENDPOINT - Export tasks as CSV
@Get('export/csv')
@Header('Content-Type', 'text/csv')
@Header('Content-Disposition', 'attachment; filename="tasks-export.csv"')
async exportCSV(
  @Request() req,
  @Res() res: Response,
  @Query('timeRange') timeRange?: string,
  @Query('startDate') startDate?: string,
  @Query('endDate') endDate?: string,
  @Query('categoryId') categoryId?: string,
  @Query('priority') priority?: string,
  @Query('status') status?: string,
): Promise<void> {
  const csv = await this.analyticsService.exportTasksCSV(req.user.id, {
    timeRange: timeRange as any,
    startDate,
    endDate,
    categoryId,
    priority,
    status,
  });
  
  res.send(csv);
}

}