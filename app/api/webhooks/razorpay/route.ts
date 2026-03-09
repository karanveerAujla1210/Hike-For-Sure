import { NextRequest, NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { trackServerEvent } from "@/lib/utils/analytics";
import { verifyRazorpayWebhook } from "@/lib/utils/razorpay";

function toIso(ts?: number | null) {
  if (!ts) return null;
  return new Date(ts * 1000).toISOString();
}

interface RazorpaySubscriptionEntity {
  id?: string;
  subscription_id?: string;
  current_start?: number;
  start_at?: number;
  current_end?: number;
  charge_at?: number;
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-razorpay-signature");
  const body = await request.text();

  if (!signature || !verifyRazorpayWebhook({ payload: body, signature })) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as {
    event: string;
    payload: {
      subscription?: { entity: RazorpaySubscriptionEntity };
      payment?: { entity: RazorpaySubscriptionEntity };
    };
  };

  const subscriptionEntity =
    event.payload.subscription?.entity ??
    event.payload.payment?.entity ??
    undefined;

  const subscriptionId = subscriptionEntity?.id ?? subscriptionEntity?.subscription_id;

  if (!subscriptionId || !subscriptionEntity) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createSupabaseAdminClient();

  const status =
    event.event === "subscription.activated" || event.event === "payment.captured"
      ? "active"
      : event.event === "subscription.cancelled"
        ? "cancelled"
        : event.event === "subscription.completed"
          ? "expired"
          : "pending";

  const periodStart =
    toIso(subscriptionEntity.current_start) ?? toIso(subscriptionEntity.start_at);
  const periodEnd =
    toIso(subscriptionEntity.current_end) ?? toIso(subscriptionEntity.charge_at);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("razorpay_subscription_id", subscriptionId)
    .single();

  await supabase
    .from("subscriptions")
    .update({
      status,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString()
    })
    .eq("razorpay_subscription_id", subscriptionId);

  if (status === "active" && subscription?.user_id) {
    await trackServerEvent({
      distinctId: subscription.user_id,
      event: "subscription_conversion",
      properties: {
        subscription_id: subscriptionId
      }
    });
  }

  return NextResponse.json({ ok: true });
}
