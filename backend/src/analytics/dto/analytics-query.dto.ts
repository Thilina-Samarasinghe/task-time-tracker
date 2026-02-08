import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum TimeRange {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  CUSTOM = 'custom'
}

export class AnalyticsQueryDto {
  @IsOptional()
  @IsEnum(TimeRange)
  timeRange?: TimeRange = TimeRange.TODAY;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  priority?: string;

  @IsOptional()
  status?: string;
}