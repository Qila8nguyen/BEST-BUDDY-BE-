import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import {
  CorsConfig,
  MessageQueueConfig,
  NestConfig,
  SwaggerConfig,
} from './common/config/config.interface'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { middleware as expressCtx } from 'express-ctx'
import { ErrorsInterceptor } from './common/interceptors/exception.interceptor'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { ExceptionFilter } from './common/filters/exception.filter'
import { Logger } from '@nestjs/common'
import { UnhandledException } from './common/exception/UnhandledException'
import { AppModule } from './app.module'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Validation

  const configService = app.get(ConfigService)
  const nestConfig = configService.get<NestConfig>('nest')
  const corsConfig = configService.get<CorsConfig>('cors')
  const swaggerConfig = configService.get<SwaggerConfig>('swagger')
  const messageQueueConfig =
    configService.get<MessageQueueConfig>('messageQueue')

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build()
    const document = SwaggerModule.createDocument(app, options)

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document)
  }

  //Config RabbitMQ microservice
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [messageQueueConfig.url],
      queue: messageQueueConfig.queue,
      queueOptions: {
        durable: false,
        noAck: false,
      },
    },
    noAck: false,
  })

  await app.startAllMicroservices()

  // Cors
  if (corsConfig.enabled) {
    app.enableCors()
  }
  app.useGlobalInterceptors(new ErrorsInterceptor(), new LoggingInterceptor())
  app.useGlobalFilters(new ExceptionFilter())
  app.use(expressCtx)

  //Handle global error NodeJS
  process.on('unhandledRejection', (e) => {
    const exception = new UnhandledException()
    const root = e as Error
    Logger.error(exception.message, root.stack, exception.name)
  })

  await app.listen(process.env.PORT || nestConfig.port || 3000)
}

bootstrap()
