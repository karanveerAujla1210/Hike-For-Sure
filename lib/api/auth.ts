import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { apiRequest } from "@/lib/api/client";

interface SignupInput {
  email: string;
  password: string;
  fullName: string;
  role: "candidate" | "recruiter" | "company_admin" | "platform_admin";
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }
}

export async function signUpWithEmail(input: SignupInput) {
  const supabase = createSupabaseBrowserClient();
  const { error, data } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        role: input.role
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function requestPasswordReset(email: string) {
  return apiRequest<{ success: boolean }>("/api/auth/reset-password", {
    method: "POST",
    json: { email }
  });
}
