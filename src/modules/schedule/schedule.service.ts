import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { EmailHandler } from '../../handler/email.handler'

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name)

  @Cron('30 * * * * *')
  handleCron(data) {
    this.logger.debug('Called when the current second is at every 11:30:00')
    const { recipients, userName, message } = data
    const emailContext = {
      recipients: recipients || ['ng.d.phuongnghi@gmail.com'],
      userName: userName || 'Annie',
      message:
        message ||
        'If you are positive, you’ll see opportunities instead of obstacles.',
    }
    const emailSend = new EmailHandler().send(emailContext)
  }
}
