import { ArgumentsHost, Catch, ExceptionFilter as Filter } from '@nestjs/common'
import { Exception } from '../exception/Exception'

@Catch(Exception)
export class ExceptionFilter implements Filter<Exception> {
  catch(exception: Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const statusCode = exception.statusCode

    response.status(statusCode).json({
      statusCode,
      method: request.method,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
