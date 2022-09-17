export class UnhandledException extends Error {
  constructor(message?) {
    super(message || 'Please add catch block for async function')
    this.name = 'UnhandledException'
  }
}
