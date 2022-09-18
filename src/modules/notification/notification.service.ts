import { Injectable, Logger } from '@nestjs/common'
import { NotificationHandlerFactory } from '../../handler/notification.handler.factory'
import { createHash } from '../../handler/subscription.handler'
import * as webpush from 'web-push'

import { BaseService } from '../base.service'
import { NotificationInputType } from './input/notification.input'

@Injectable()
export class NotificationService extends BaseService {
  private subscriptions = {}
  constructor() {
    super()
  }

  push(payload) {
    return new NotificationHandlerFactory(payload.type).handler.send(
      payload.notifyOptions,
    )
  }

  subscribe(data) {
    Logger.log('data subscribe :>>', data)
    const subscriptionRequest = data
    const susbscriptionId = createHash(JSON.stringify(subscriptionRequest))
    this.subscriptions[susbscriptionId] = subscriptionRequest
    console.log('subscriptions', this.subscriptions)
    Logger.log('subscript id :>>', { id: susbscriptionId })
    return { id: susbscriptionId }
  }

  pushBrowserNotification(id) {
    const subscriptionId = id
    const pushSubscription = this.subscriptions[subscriptionId]
    console.log('push', pushSubscription)
    webpush
      .sendNotification(
        pushSubscription,
        JSON.stringify({
          title: 'SELF AFFIRMATION',
          text: 'You are the most unique and beautiful person',
          image: '/images/jason-leung-HM6TMmevbZQ-unsplash.jpg',
          tag: 'affirmation',
          url: 'https://self-mood.web.app',
        }),
      )
      .catch((err) => {
        Logger.log(err, 'CANNOT PUSH NOTIFICATION')
      })
  }

  async createData(data: NotificationInputType) {
    const { userName, manifestList, subscriptionId } = data
    return await this.prisma.notification.create({
      data: {
        userName: 'Nghi',
        message: 'Hello',
        manifestList,
        subscriptionId,
      },
    })
  }

  async listAll() {
    return await this.prisma.notification.findMany({
      where: {},
    })
  }
}
