import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { NotificationResolver } from './notification.resolver'
import { PrismaService } from 'nestjs-prisma'

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, PrismaService, NotificationResolver],
})
export class NotificationModule {}
