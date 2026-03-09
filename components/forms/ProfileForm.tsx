"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";

interface ProfileFormProps {
  initialProfile: {
    full_name: string | null;
    headline: string | null;
    location: string | null;
    bio: string | null;
    profile_image_url: string | null;
  };
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialProfile.full_name ?? "");
  const [headline, setHeadline] = useState(initialProfile.headline ?? "");
  const [location, setLocation] = useState(initialProfile.location ?? "");
  const [bio, setBio] = useState(initialProfile.bio ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads/profile-image", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Failed to upload profile image.");
    }
    const payload = await response.json();
    return payload.path as string;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      let profileImagePath: string | null = null;
      if (imageFile) {
        profileImagePath = await uploadImage(imageFile);
      }

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName,
          headline,
          location,
          bio,
          profileImagePath
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Failed to update profile");
      }

      setStatus("Profile saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full name" />
      <Input value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder="Headline" />
      <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" />
      <Textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Professional summary" />
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
      />
      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
