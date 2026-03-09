import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/utils/rate-limit";

const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100),
  headline: z.string().max(180).nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  bio: z.string().max(2000).nullable().optional(),
  profileImagePath: z.string().nullable().optional()
});

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const allowed = await enforceRateLimit({
    route: "profile-update",
    identifier: auth.userId,
    limit: 30,
    windowSeconds: 3600
  });

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      headline: parsed.data.headline ?? null,
      location: parsed.data.location ?? null,
      bio: parsed.data.bio ?? null,
      profile_image_url: parsed.data.profileImagePath ?? undefined
    })
    .eq("id", auth.userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
