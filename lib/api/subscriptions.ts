import { apiRequest } from "@/lib/api/client";
import type { SubscriptionPlan } from "@/types/platform";

export async function createSubscriptionCheckout(plan: SubscriptionPlan) {
  return apiRequest<{
    subscriptionId: string;
    razorpayKeyId: string;
    amountInPaise: number;
    currency: string;
  }>("/api/subscriptions/create-checkout", {
    method: "POST",
    json: { plan }
  });
}
