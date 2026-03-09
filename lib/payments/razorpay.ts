import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
})

export async function createSubscription(planId: string, customerId?: string) {
  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: 12,
    ...(customerId && { customer_id: customerId }),
  })

  return subscription
}

export async function createOrder(amount: number, currency = 'INR') {
  const order = await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency,
    receipt: `receipt_${Date.now()}`,
  })

  return order
}

export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const text = `${orderId}|${paymentId}`
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET!)
    .update(text)
    .digest('hex')

  return generated_signature === signature
}

export async function verifyWebhookSignature(body: string, signature: string) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  return expectedSignature === signature
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await razorpay.subscriptions.cancel(subscriptionId)
  return subscription
}

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['3 job posts per month', 'Basic support'],
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 999,
    razorpayPlanId: process.env.RAZORPAY_PRO_PLAN_ID,
    features: [
      'Unlimited job posts',
      'Applicant analytics',
      'Priority support',
      'Featured job listings',
    ],
  },
}
