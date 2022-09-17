import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { PrismaService } from './db/prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import config from './common/config/config'
import { PrismaModule } from 'nestjs-prisma'
import { DBLoggerMiddleware } from './common/middleware/db.logger.middleware'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { NotificationModule } from './modules/notification/notification.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphqlProvider } from './providers/graphql.provider'
import { IntegrationModule } from './modules/integration/integration.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      expandVariables: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [DBLoggerMiddleware()], // configure your prisma middleware
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphqlProvider,
    }),
    NotificationModule,
    IntegrationModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET })
  }
}
