// import { Logger } from '@nestjs/common'
// import { PrismaClient } from '@prisma/client'

// export function DBLoggerMiddleware(): PrismaClient.Middleware {
//   return async (params, next) => {
//     const before = Date.now()
//     const result = await next(params)
//     const after = Date.now()

//     Logger.log(
//       `Prisma Query ${params.model}.${params.action} took ${after - before}ms`,
//     )
//     return result
//   }
// }
