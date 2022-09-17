import { HttpStatus } from '@nestjs/common'

export class Exception extends Error {
  private readonly _statusCode: HttpStatus

  constructor(
    message,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message)
    this.name = this.constructor.name
    this._statusCode = statusCode
  }

  get statusCode(): HttpStatus {
    return this._statusCode
  }
}
