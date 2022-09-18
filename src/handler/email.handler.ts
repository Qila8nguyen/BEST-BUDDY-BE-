import { createTransport, Transporter } from 'nodemailer'
import * as EmailTemplate from 'email-templates'
import { AbstractNotificationHandler } from './abstract.notification.handler'
import { NotificationEntity } from '../modules/notification/entity/notification.entity'

export class EmailHandler extends AbstractNotificationHandler {
  private transporter: Transporter
  constructor(options?) {
    super()
    const emailClientOptions: any = {
      host: options?.host || process.env.SMTP_HOST,
      port: options?.port || parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: options?.auth?.user || process.env.SMTP_SENDER,
        pass: options?.auth?.pass || process.env.SMTP_SENDER_PASSWORD,
      },
    }
    console.log('emailClientOptions :>>', emailClientOptions)
    this.transporter = createTransport(emailClientOptions)
  }

  async send(emailContext: any) {
    const { recipients, message } = emailContext

    const { transporter } = this
    const emailTemplate = new EmailTemplate()

    const templateEmail = 'layout'
    const mailContext = {
      ['title']: 'Keep Manifesting',
      ['body']: message,
    }

    const html = await emailTemplate.render(
      `templates/${templateEmail}.pug`,
      mailContext,
    )

    const messageToSend = {
      from: `${process.env.SMTP_SENDER_NAME} <${process.env.SMTP_SENDER}>`,
      to: recipients,
      subject: 'Self mood',
      text: 'Hello world',
      html,
    }
    try {
      console.log('email recipient =>', emailContext, '\n', messageToSend)
      await transporter.sendMail(messageToSend)
    } catch (error) {
      console.log(error)
    }
  }
}
