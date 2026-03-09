import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth/server";
import { uploadProfileImage } from "@/lib/utils/storage";
import { enforceRateLimit } from "@/lib/utils/rate-limit";

const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];
const maxSize = 2 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const allowed = await enforceRateLimit({
    route: "profile-image-upload",
    identifier: auth.userId,
    limit: 20,
    windowSeconds: 3600
  });
  if (!allowed) {
    return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!allowedMimeTypes.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
  }

  if (file.size > maxSize) {
    return NextResponse.json({ error: "Image size exceeds 2MB" }, { status: 400 });
  }

  const path = await uploadProfileImage(auth.userId, file);
  return NextResponse.json({ path });
}
