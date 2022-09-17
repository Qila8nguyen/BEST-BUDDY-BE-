import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ResponseStatusEnum } from './enum/response.status.enum'

interface HealthCheckOutput {
  message: string
  status: ResponseStatusEnum
}

@Controller()
@ApiTags('Application')
export class AppController {
  @Get('/health-check')
  async healthCheck(): Promise<HealthCheckOutput> {
    return {
      message: 'Service is up',
      status: ResponseStatusEnum.SUCCESS,
    }
  }
}
