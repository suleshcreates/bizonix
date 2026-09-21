import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Rate limiting map: tracks upload timestamps per identifier (userId or IP)
const uploadAttempts = new Map<string, number[]>();
const UPLOAD_RATE_WINDOW_MS = 60_000; // 1 minute
const MAX_UPLOADS_PER_WINDOW = 10;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit

// Allowed MIME types mapped to their canonical extension and magic byte checkers
type MagicByteChecker = (buffer: Buffer) => boolean;

interface FileFormatSpec {
  mime: string;
  ext: string;
  check: MagicByteChecker;
}

const ALLOWED_FORMATS: FileFormatSpec[] = [
  {
    mime: "image/png",
    ext: ".png",
    check: (buf) =>
      buf.length >= 8 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a,
  },
  {
    mime: "image/jpeg",
    ext: ".jpg",
    check: (buf) =>
      buf.length >= 3 &&
      buf[0] === 0xff &&
      buf[1] === 0xd8 &&
      buf[2] === 0xff,
  },
  {
    mime: "image/webp",
    ext: ".webp",
    check: (buf) =>
      buf.length >= 12 &&
      buf.toString("ascii", 0, 4) === "RIFF" &&
      buf.toString("ascii", 8, 12) === "WEBP",
  },
  {
    mime: "image/gif",
    ext: ".gif",
    check: (buf) =>
      buf.length >= 6 &&
      (buf.toString("ascii", 0, 6) === "GIF87a" || buf.toString("ascii", 0, 6) === "GIF89a"),
  },
];

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const timestamps = (uploadAttempts.get(identifier) || []).filter(
    (ts) => now - ts < UPLOAD_RATE_WINDOW_MS,
  );
  if (timestamps.length >= MAX_UPLOADS_PER_WINDOW) {
    return false;
  }
  timestamps.push(now);
  uploadAttempts.set(identifier, timestamps);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // -------------------------------------------------------------------------
    // 1. Authentication & Authorization (BIZ-SEC-001)
    // -------------------------------------------------------------------------
    const accessToken = request.cookies.get("bz_admin_access")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required to upload assets." },
        { status: 401 },
      );
    }

    const apiUrl = (
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001/api/v1"
    ).replace(/\/$/, "");

    let currentUser: { id: string; roles: string[]; permissions: string[] };
    try {
      const authRes = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          Cookie: `bz_admin_access=${accessToken}`,
        },
        cache: "no-store",
      });

      if (!authRes.ok) {
        return NextResponse.json(
          { error: "Invalid or expired session. Please log in again." },
          { status: 401 },
        );
      }
      currentUser = await authRes.json();
    } catch (authErr) {
      return NextResponse.json(
        { error: "Authentication service unavailable." },
        { status: 503 },
      );
    }

    // Require SUPER_ADMIN or any write permission
    const isSuperAdmin = currentUser.roles?.includes("SUPER_ADMIN");
    const hasWritePermission = currentUser.permissions?.some((p) => p.endsWith(".write"));
    if (!isSuperAdmin && !hasWritePermission) {
      return NextResponse.json(
        { error: "Insufficient permissions to upload assets." },
        { status: 403 },
      );
    }

    // -------------------------------------------------------------------------
    // 2. Rate Limiting & Abuse Prevention (BIZ-SEC-008)
    // -------------------------------------------------------------------------
    const rateLimitKey = currentUser.id || "unknown";
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: "Too many upload requests. Please wait a moment before trying again." },
        { status: 429 },
      );
    }

    // -------------------------------------------------------------------------
    // 3. Request Body & File Validation
    // -------------------------------------------------------------------------
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Explicit rejection of SVG (CWE-434 / CWE-79)
    const originalName = file.name || "";
    if (
      file.type === "image/svg+xml" ||
      originalName.toLowerCase().endsWith(".svg")
    ) {
      return NextResponse.json(
        { error: "SVG file uploads are prohibited for security reasons. Please use PNG, JPEG, or WebP." },
        { status: 400 },
      );
    }

    // Size limit check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.` },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Magic byte content validation (Do not trust filename or client Content-Type)
    const matchedFormat = ALLOWED_FORMATS.find((format) => format.check(buffer));
    if (!matchedFormat) {
      return NextResponse.json(
        { error: "Invalid file signature. File content does not match permitted image formats (PNG, JPEG, WebP, GIF)." },
        { status: 400 },
      );
    }

    // -------------------------------------------------------------------------
    // 4. Secure File Storage & Path Isolation
    // -------------------------------------------------------------------------
    // Generate server-controlled random filename (prevents path traversal / overwriting)
    const safeFilename = `${Date.now()}_${crypto.randomUUID()}${matchedFormat.ext}`;

    const adminUploadDir = path.resolve(process.cwd(), "public/uploads");
    if (!fs.existsSync(adminUploadDir)) {
      fs.mkdirSync(adminUploadDir, { recursive: true });
    }
    const adminFilePath = path.join(adminUploadDir, safeFilename);
    fs.writeFileSync(adminFilePath, buffer);

    // Mirror to website/public/uploads if accessible
    try {
      const websiteUploadDir = path.resolve(process.cwd(), "../website/public/uploads");
      if (!fs.existsSync(websiteUploadDir)) {
        fs.mkdirSync(websiteUploadDir, { recursive: true });
      }
      const websiteFilePath = path.join(websiteUploadDir, safeFilename);
      fs.writeFileSync(websiteFilePath, buffer);
    } catch {
      // Ignored if standalone
    }

    return NextResponse.json({
      success: true,
      url: `/uploads/${safeFilename}`,
      filename: safeFilename,
      size: file.size,
      mimeType: matchedFormat.mime,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "An unexpected error occurred while processing the upload." },
      { status: 500 },
    );
  }
}
