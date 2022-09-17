import { Injectable, Logger } from '@nestjs/common'

import { BaseService } from '../base.service'

@Injectable()
export class NotificationService extends BaseService {
  constructor() {
    super()
  }

  push(data) {
    console.log('data', data)
  }
}
