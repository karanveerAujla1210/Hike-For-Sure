import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, headline, location, bio, profile_image_url")
    .eq("id", user.id)
    .single();

  return (
    <PageShell
      title="Profile"
      subtitle="Build your professional profile and keep your details updated."
    >
      <div className="max-w-2xl">
        <ProfileForm
          initialProfile={{
            full_name: profile?.full_name ?? null,
            headline: profile?.headline ?? null,
            location: profile?.location ?? null,
            bio: profile?.bio ?? null,
            profile_image_url: profile?.profile_image_url ?? null
          }}
        />
      </div>
    </PageShell>
  );
}
