import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common'
import { NotificationService } from './notification.service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { Request } from 'express'

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('notification.push')
  pushSlack(@Payload() data: String, @Ctx() context: RmqContext) {
    return this.notificationService.push(data)
  }

  @Post('/subscription')
  subscribeNotification(@Req() req: Request) {
    return this.notificationService.subscribe(req.body.data)
  }

  @Get('/subscription/:id')
  pushNotification(@Param('id') params) {
    const id = params.id
    return this.notificationService.pushBrowserNotification(params)
  }
}
