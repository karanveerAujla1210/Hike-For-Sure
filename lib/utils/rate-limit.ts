import { createSupabaseAdminClient } from "@/lib/supabase/server";

interface RateLimitConfig {
  route: string;
  identifier: string;
  limit?: number;
  windowSeconds?: number;
}

export async function enforceRateLimit({
  route,
  identifier,
  limit = 60,
  windowSeconds = 60
}: RateLimitConfig) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_identifier: identifier,
    p_route: route,
    p_limit: limit,
    p_window_seconds: windowSeconds
  });

  if (error) {
    throw new Error(`Rate limit check failed: ${error.message}`);
  }

  return Boolean(data);
}
