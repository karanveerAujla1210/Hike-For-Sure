import crypto from "crypto";

import Razorpay from "razorpay";

import { getServerEnv } from "@/lib/utils/env";

let razorpayClient: Razorpay | null = null;

export function getRazorpayClient() {
  if (razorpayClient) {
    return razorpayClient;
  }

  const env = getServerEnv();
  razorpayClient = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_SECRET
  });

  return razorpayClient;
}

export function verifyRazorpayWebhook({
  payload,
  signature
}: {
  payload: string;
  signature: string;
}) {
  const env = getServerEnv();

  if (!env.RAZORPAY_WEBHOOK_SECRET) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET is required for webhook validation.");
  }

  const generated = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return generated === signature;
}
