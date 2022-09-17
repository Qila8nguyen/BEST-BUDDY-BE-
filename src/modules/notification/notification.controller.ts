import { Controller } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('notification.push')
  pushSlack(@Payload() data: String, @Ctx() context: RmqContext) {
    return this.notificationService.push(data)
  }
}
