import type { Config } from './config.interface'

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'NestJS - Prisma - API',
    description: 'The nestjs API description',
    version: '1.0.0',
    path: 'docs',
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  messageQueue: {
    url: `amqp://${process.env.MQ_USER}:${process.env.MQ_PASSWORD}@${process.env.MQ_HOST}:${process.env.MQ_PORT}`,
    queue: process.env.MQ_QUEUE,
  },
  graphql: {
    playgroundEnabled: false,
    debug: true,
    schemaDestination: './src/schema.gql',
    sortSchema: true,
  },
}

export default (): Config => config
