import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('time-entries')
@UseGuards(JwtAuthGuard)
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Post('start/:taskId')
  startTimer(@Param('taskId') taskId: string, @Request() req) {
    return this.timeEntriesService.startTimer(taskId, req.user.id);
  }

  @Post('stop/:entryId')
  stopTimer(@Param('entryId') entryId: string, @Request() req) {
    return this.timeEntriesService.stopTimer(entryId, req.user.id);
  }

  @Get('active')
  getActiveTimer(@Request() req) {
    return this.timeEntriesService.getActiveTimer(req.user.id);
  }

  @Get('task/:taskId')
  getTaskTimeEntries(@Param('taskId') taskId: string, @Request() req) {
    return this.timeEntriesService.getTaskTimeEntries(taskId, req.user.id);
  }
}