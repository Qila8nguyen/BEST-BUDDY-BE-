import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { ScheduleService } from './schedule.service'

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('')
  scheduleNoti(@Req() req: Request) {
    const data = req.body.data
    this.scheduleService.handleCron(data)
  }
}
