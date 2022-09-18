import * as webpush from 'web-push'
import * as crypto from 'crypto'

const subscriptions = {}
const vapidKeys = {
  privateKey: 'bdSiNzUhUP6piAxLH-tW88zfBlWWveIx0dAsDO66aVU',
  publicKey:
    'BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8',
}

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
)

export function createHash(input: string) {
  const md5sum = crypto.createHash('sha256')
  md5sum.update(Buffer.from(input))
  return md5sum.digest('hex')
}

export const handlePushNotificationSubscription = (req, res) => {
  const subscriptionRequest = req.body.data
  const susbscriptionId = createHash(JSON.stringify(subscriptionRequest))
  subscriptions[susbscriptionId] = subscriptionRequest
  res.status(201).json({ id: susbscriptionId })
}

export const sendPushNotification = (req, res) => {
  const subscriptionId = req.params.id
  const pushSubscription = subscriptions[subscriptionId]
  webpush
    .sendNotification(
      pushSubscription,
      JSON.stringify({
        title: 'SELF AFFIRMATION',
        text: 'You are the most unique and beautiful person',
        image: '/images/jason-leung-HM6TMmevbZQ-unsplash.jpg',
        tag: 'affirmation',
        url: 'http://localhost:3600',
      }),
    )
    .catch((err) => {
      console.log(err)
    })

  res.status(202).json({})
}
