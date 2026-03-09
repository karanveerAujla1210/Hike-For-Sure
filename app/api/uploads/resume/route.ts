import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/server";
import { uploadResume } from "@/lib/utils/storage";
import { enforceRateLimit } from "@/lib/utils/rate-limit";

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const maxSize = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const auth = await requireRole(["candidate", "recruiter", "company_admin"]);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const allowed = await enforceRateLimit({
    route: "resume-upload",
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
    return NextResponse.json({ error: "Unsupported resume format" }, { status: 400 });
  }

  if (file.size > maxSize) {
    return NextResponse.json({ error: "Resume size exceeds 5MB" }, { status: 400 });
  }

  const path = await uploadResume(auth.userId, file);
  return NextResponse.json({ path });
}
