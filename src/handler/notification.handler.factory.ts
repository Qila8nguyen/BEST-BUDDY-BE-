import { NotificationTypeEnum } from '../enum/notification.type.enum'
import { EmailHandler } from './email.handler'
import { AbstractNotificationHandler } from './abstract.notification.handler'
import { InAppHandler } from './in-app.handler'

export class NotificationHandlerFactory {
  private readonly _handler: AbstractNotificationHandler
  constructor(type: NotificationTypeEnum) {
    switch (type) {
      case NotificationTypeEnum.EMAIL:
        this._handler = new EmailHandler()
        break

      case NotificationTypeEnum.IN_APP:
        this._handler = new InAppHandler()
        break
      default:
        throw new Error('Type is not supported')
    }
  }

  get handler(): AbstractNotificationHandler {
    return this._handler
  }
}
