import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/utils/rate-limit";
import { messageSchema } from "@/lib/utils/validation";

const markReadSchema = z.object({
  messageId: z.string().uuid()
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const withUser = request.nextUrl.searchParams.get("with");
  if (!withUser) {
    return NextResponse.json({ error: "Missing `with` query parameter" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, content, is_read, read_at, created_at")
    .or(
      `and(sender_id.eq.${auth.userId},receiver_id.eq.${withUser}),and(sender_id.eq.${withUser},receiver_id.eq.${auth.userId})`
    )
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ messages: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const allowed = await enforceRateLimit({
    route: "messages-send",
    identifier: auth.userId,
    limit: 120,
    windowSeconds: 60
  });

  if (!allowed) {
    return NextResponse.json({ error: "Too many messages" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: auth.userId,
      receiver_id: parsed.data.receiverId,
      content: parsed.data.content
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to send message" }, { status: 400 });
  }

  await supabase.from("notifications").insert({
    user_id: parsed.data.receiverId,
    type: "new_message",
    title: "New message",
    message: "You have a new message on Hike For Sure.",
    link: `/messages?with=${auth.userId}`
  });

  return NextResponse.json({ id: data.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const body = await request.json().catch(() => null);
  const parsed = markReadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("id", parsed.data.messageId)
    .eq("receiver_id", auth.userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
