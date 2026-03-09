import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getServerEnv } from "@/lib/utils/env";
import { enforceRateLimit } from "@/lib/utils/rate-limit";
import { getRazorpayClient } from "@/lib/utils/razorpay";
import { subscriptionCheckoutSchema } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  const auth = await requireRole(["recruiter", "company_admin", "platform_admin"]);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const allowed = await enforceRateLimit({
    route: "subscription-checkout",
    identifier: auth.userId,
    limit: 10,
    windowSeconds: 3600
  });

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = subscriptionCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const env = getServerEnv();

  if (parsed.data.plan === "free") {
    const { error } = await supabase.from("subscriptions").upsert(
      {
        user_id: auth.userId,
        plan_type: "free",
        status: "active",
        job_posts_limit: 3,
        job_posts_used: 0
      },
      { onConflict: "user_id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      subscriptionId: "free-plan",
      razorpayKeyId: env.RAZORPAY_KEY_ID,
      amountInPaise: 0,
      currency: "INR"
    });
  }

  const razorpay = getRazorpayClient();
  const plan = await razorpay.plans.create({
    period: "monthly",
    interval: 1,
    item: {
      name: "Hike For Sure Pro",
      amount: 99900,
      currency: "INR",
      description: "Unlimited job posts with analytics"
    },
    notes: {
      source: "hike-for-sure"
    }
  });

  const subscription = await razorpay.subscriptions.create({
    plan_id: plan.id,
    customer_notify: 1,
    total_count: 120,
    notes: {
      user_id: auth.userId
    }
  });

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: auth.userId,
      plan_type: "pro",
      status: "pending",
      razorpay_subscription_id: subscription.id,
      job_posts_limit: -1,
      job_posts_used: 0
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    subscriptionId: subscription.id,
    razorpayKeyId: env.RAZORPAY_KEY_ID,
    amountInPaise: 99900,
    currency: "INR"
  });
}
