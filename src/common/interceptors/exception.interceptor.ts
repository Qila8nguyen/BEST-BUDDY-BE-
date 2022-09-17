import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Exception } from '../exception/Exception'

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((e) => {
        if (e instanceof Exception) {
          return throwError(e)
        }
        Logger.error(e.message, e.stack, e.name)
        return throwError(
          new Exception(e.message, HttpStatus.INTERNAL_SERVER_ERROR),
        )
      }),
    )
  }
}
