import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth/server";
import { trackServerEvent } from "@/lib/utils/analytics";
import { analyticsEventSchema } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const body = await request.json().catch(() => null);
  const parsed = analyticsEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  await trackServerEvent({
    distinctId: auth.userId,
    event: parsed.data.event,
    properties: parsed.data.payload
  });

  return NextResponse.json({ success: true });
}
