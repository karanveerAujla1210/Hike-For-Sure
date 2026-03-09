import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

async function generateHmac(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("x-razorpay-signature");
  const payload = await req.text();

  const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!signature || !secret || !supabaseUrl || !serviceRoleKey) {
    return new Response("Missing webhook requirements", { status: 400 });
  }

  const expected = await generateHmac(secret, payload);
  if (expected !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(payload) as {
    event: string;
    payload: {
      subscription?: { entity: Record<string, unknown> };
      payment?: { entity: Record<string, unknown> };
    };
  };

  const entity =
    event.payload.subscription?.entity ?? event.payload.payment?.entity ?? {};
  const subscriptionId =
    (entity.id as string | undefined) ??
    (entity.subscription_id as string | undefined);

  if (!subscriptionId) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  const status =
    event.event === "subscription.activated" || event.event === "payment.captured"
      ? "active"
      : event.event === "subscription.cancelled"
        ? "cancelled"
        : "pending";

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq("razorpay_subscription_id", subscriptionId);

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
});
