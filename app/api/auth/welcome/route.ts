import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendSignupEmail } from "@/lib/utils/email";
import { enforceRateLimit } from "@/lib/utils/rate-limit";

const welcomeSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(80).optional()
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await enforceRateLimit({
    route: "signup-welcome-email",
    identifier: ip,
    limit: 20,
    windowSeconds: 3600
  });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = welcomeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  await sendSignupEmail(parsed.data.email, parsed.data.name ?? null);
  return NextResponse.json({ success: true });
}
