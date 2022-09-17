import { Injectable } from '@nestjs/common'
import { GqlOptionsFactory } from '@nestjs/graphql'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'
import { GraphqlConfig } from '../common/config/config.interface'
import { ApolloDriverConfig } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'

@Injectable()
export class GraphqlProvider implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig = this.configService.get<GraphqlConfig>('graphql')
    return {
      autoSchemaFile:
        graphqlConfig.schemaDestination ||
        join(process.cwd(), 'src/schema.gql'),
      sortSchema: graphqlConfig.sortSchema,
      buildSchemaOptions: {},
      plugins: [ApolloServerPluginLandingPageLocalDefault()],

      debug: graphqlConfig.debug,
      playground: graphqlConfig.playgroundEnabled,
      formatError: (error) => {
        return {
          message: error.message,
          statusCode:
            error.extensions.exception['_statusCode'] ||
            error.extensions?.exception['status'] ||
            error.extensions?.code,
          timestamp: new Date().toISOString(),
        }
      },
    }
  }
}
