import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { NotificationService } from './notification.service'

@Resolver(() => String)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}
}
