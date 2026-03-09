import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasRole } from "@/lib/auth/roles";
import type { AuthProfile, UserRole } from "@/types/platform";

export interface AuthContext {
  userId: string;
  profile: AuthProfile;
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, email, full_name, company_id")
    .eq("id", data.user.id)
    .single<AuthProfile>();

  if (!profile) {
    return null;
  }

  return {
    userId: data.user.id,
    profile
  };
}

export async function requireAuth() {
  const auth = await getAuthContext();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return auth;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const auth = await getAuthContext();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasRole(auth.profile.role, allowedRoles)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return auth;
}
