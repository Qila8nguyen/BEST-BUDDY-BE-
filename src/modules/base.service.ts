import { Logger } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { InAppNotification } from './notification/entities/InAppNotification'
import { InAppNotificationOptions } from './notification/notification.service'

export class BaseService {
  prisma: PrismaService
  constructor() {
    this.prisma = new PrismaService()
  }

  async create(data: InAppNotificationOptions) {
    return this.prisma.inAppNotification.create({
      data: {
        ...data,
      },
    })
  }

  async findAllAvailable(conditions: Partial<InAppNotification>) {
    Logger.log(
      `Find all notifications where: ${conditions}`,
      'findAllAvailable()',
    )
    return this.prisma.inAppNotification.findMany({
      where: {
        ...conditions,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async update(id: number, updateData: any) {
    Logger.log(`Update notification with: ${updateData}`, 'update()')
    return this.prisma.inAppNotification.update({
      where: {
        id,
      },
      data: {
        ...updateData,
      },
    })
  }

  async delete(id: number) {
    Logger.log(`Delete notification`)
    return this.update(id, { deletedAt: new Date() })
  }

  async countBy(conditions: any) {
    Logger.log('Count by')
    return this.prisma.inAppNotification.count({
      where: {
        ...conditions,
      },
    })
  }
}
