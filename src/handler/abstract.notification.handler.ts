import { Logger } from '@nestjs/common'

export abstract class AbstractNotificationHandler {
  private readonly type
  constructor() {
    this.type = this.constructor.name
  }
  abstract send(context?: any)
  log(...message) {
    for (const i of message) {
      Logger.log(i, this.type)
    }
  }
}
