import { NextRequest, NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sendPasswordResetEmail } from "@/lib/utils/email";
import { getServerEnv } from "@/lib/utils/env";
import { enforceRateLimit } from "@/lib/utils/rate-limit";
import { resetPasswordSchema } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await enforceRateLimit({
    route: "auth-reset-password",
    identifier: ip,
    limit: 10,
    windowSeconds: 600
  });

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const env = getServerEnv();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email: parsed.data.email,
    options: {
      redirectTo: `${env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/login`
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const resetLink = data.properties?.action_link;
  if (resetLink) {
    await sendPasswordResetEmail(parsed.data.email, resetLink);
  }

  return NextResponse.json({ success: true });
}
