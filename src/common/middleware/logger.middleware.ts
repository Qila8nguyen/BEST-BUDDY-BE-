import { Injectable, Logger, NestMiddleware } from '@nestjs/common'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    Logger.log(`${req.method} ${req.url}`, 'LoggerMiddleware')
    next()
  }
}
