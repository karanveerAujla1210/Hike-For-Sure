import { createSupabaseServerClient } from "@/lib/supabase/server";

type BucketName = "resumes" | "profile-images" | "company-logos";

function getFileExtension(fileName: string) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop() : "bin";
}

async function uploadFile(bucket: BucketName, userId: string, file: File) {
  const supabase = createSupabaseServerClient();
  const fileExt = getFileExtension(file.name || "file.bin");
  const filePath = `${userId}/${Date.now()}.${fileExt}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, Buffer.from(bytes), {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  return filePath;
}

export async function uploadResume(userId: string, file: File) {
  return uploadFile("resumes", userId, file);
}

export async function uploadProfileImage(userId: string, file: File) {
  return uploadFile("profile-images", userId, file);
}

export async function uploadCompanyLogo(userId: string, file: File) {
  return uploadFile("company-logos", userId, file);
}

export async function getBucketPublicUrl(bucket: BucketName, filePath: string) {
  const supabase = createSupabaseServerClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
