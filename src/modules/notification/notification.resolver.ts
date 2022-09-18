import { Logger } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { NotificationEntity } from './entity/notification.entity'
import { NotificationInputType } from './input/notification.input'

import { NotificationService } from './notification.service'

@Resolver(() => String)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => String, { name: 'listAll' })
  async list() {
    return await this.notificationService.listAll()
  }

  @Mutation(() => NotificationEntity)
  async createMessage(@Args('data') data: NotificationInputType) {
    try {
      return await this.notificationService.createData(data)
    } catch (e) {
      Logger.log(e, 'CANNOT CREATE NOTIFICATION')
    }
  }
}
