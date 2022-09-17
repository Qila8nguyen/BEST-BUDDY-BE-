import { Prisma } from '@prisma/client'
import { Logger } from '@nestjs/common'

export function DBLoggerMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const before = Date.now()
    const result = await next(params)
    const after = Date.now()

    Logger.log(
      `Prisma Query ${params.model}.${params.action} took ${after - before}ms`,
    )
    return result
  }
}
