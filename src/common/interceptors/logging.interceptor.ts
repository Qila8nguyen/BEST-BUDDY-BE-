import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { req } = GqlExecutionContext.create(context).getContext()
    Logger.log(`${req.method} ${req.url}`, req.user?.name || 'Anonymous')
    const now = Date.now()
    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(
            `Done ${req.method} ${req.url} ${Date.now() - now}ms`,
            req.user?.name || 'Anonymous',
          ),
        ),
      )
  }
}
