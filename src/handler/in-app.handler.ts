import { PrismaService } from 'nestjs-prisma'
import { AbstractNotificationHandler } from './abstract.notification.handler'

export class InAppHandler extends AbstractNotificationHandler {
  private prisma: PrismaService
  constructor() {
    super()
    this.prisma = new PrismaService()
  }
  async send(options) {
    this.log(options)
  }
}
