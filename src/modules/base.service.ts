import { Logger } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

export class BaseService {
  prisma: PrismaService
  constructor() {
    this.prisma = new PrismaService()
  }
}
