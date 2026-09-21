import { NextRequest, NextResponse } from "next/server";
import { priorityOptions, roleOptions, timelineOptions } from "@/lib/content/contact/contact-content";

type DemoRequest = {
  fullName?: string; companyName?: string; city?: string; outletCount?: string;
  currentSoftware?: string; role?: string; priorities?: string[]; timeline?: string;
  email?: string; phone?: string; notes?: string; consent?: boolean; website?: string;
  elapsedMs?: number; utm?: Record<string, string>;
};

type RateLimitRecord = { count: number; firstAttempt: number; lastAttempt: number };
const ipRateLimits = new Map<string, RateLimitRecord>();
const emailRateLimits = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS_PER_IP = 5;
const MAX_ATTEMPTS_PER_EMAIL = 2;
const MIN_FILL_MS = 2_500;
const clean = (value: unknown, max = 400) => typeof value === "string" ? value.trim().slice(0, max) : "";

function getClientIp(request: NextRequest): string {
  const reqIp = (request as any).ip;
  if (reqIp) return reqIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    // Use last hop or first if single
    if (parts.length > 0) return parts[parts.length - 1];
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function checkAndRecordRateLimit(
  map: Map<string, RateLimitRecord>,
  key: string,
  maxAllowed: number,
  windowMs: number
): boolean {
  const now = Date.now();
  if (map.size > 1000) {
    for (const [k, v] of map.entries()) {
      if (now - v.lastAttempt > windowMs * 2) {
        map.delete(k);
      }
    }
  }

  const record = map.get(key);
  if (!record || now - record.firstAttempt > windowMs) {
    map.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
    return true;
  }

  if (record.count >= maxAllowed) {
    return false;
  }

  record.count += 1;
  record.lastAttempt = now;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as DemoRequest;
    // Do not disclose bot defenses.
    if (clean(data.website) || (typeof data.elapsedMs === "number" && data.elapsedMs < MIN_FILL_MS)) {
      return NextResponse.json({ success: true });
    }

    const ip = getClientIp(request);
    if (!checkAndRecordRateLimit(ipRateLimits, ip, MAX_ATTEMPTS_PER_IP, WINDOW_MS)) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute before trying again." }, { status: 429 });
    }

    const fullName = clean(data.fullName, 120);
    const companyName = clean(data.companyName, 160);
    const city = clean(data.city, 100);
    const outletCount = clean(data.outletCount, 60);
    const currentSoftware = clean(data.currentSoftware, 160);
    const role = clean(data.role, 60);
    const timeline = clean(data.timeline, 60);
    const email = clean(data.email, 160);
    const phone = clean(data.phone, 40);
    const notes = clean(data.notes, 2_000);
    const priorities = Array.isArray(data.priorities)
      ? data.priorities.map((value) => clean(value, 60)).filter((value) => priorityOptions.some((option) => option.value === value)).slice(0, 2)
      : [];
    const valid = fullName && companyName && city && outletCount && currentSoftware &&
      roleOptions.some((option) => option.value === role) &&
      timelineOptions.some((option) => option.value === timeline) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && /^[+\d][\d\s-]{7,17}$/.test(phone) &&
      priorities.length > 0 && data.consent;
    if (!valid) return NextResponse.json({ error: "Please check the required fields." }, { status: 400 });

    // Secondary rate limiting by recipient email to stop distributed bot floods targeting same victim or backend
    if (!checkAndRecordRateLimit(emailRateLimits, email.toLowerCase(), MAX_ATTEMPTS_PER_EMAIL, WINDOW_MS)) {
      return NextResponse.json({ error: "A demo request has already been submitted for this email. Please wait a moment." }, { status: 429 });
    }

    const apiUrl = (process.env.BIZONIX_API_URL || "http://localhost:3001/api/v1").replace(/\/$/, "");
    const response = await fetch(`${apiUrl}/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": ip, "User-Agent": request.headers.get("user-agent") || "Bizonix website" },
      body: JSON.stringify({
        fullName, companyName, email, phone, city, outletCount, currentSoftware, role, priorities, timeline,
        intent: "Book a Demo", source: "Website contact form", page: "/contact", message: notes || undefined,
        metadata: { consent: true, elapsedMs: data.elapsedMs, utm: data.utm || {} },
      }),
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json({ error: result?.message || "We could not record your request. Please try again." }, { status: response.status >= 500 ? 503 : response.status });
    }
    return NextResponse.json({ success: true, id: result.id, message: "Your demo request has been forwarded to the Bizonix team. We will get back to you shortly." });
  } catch (error) {
    console.error("Demo request intake failed", error);
    return NextResponse.json({ error: "We could not record your request. Please try again shortly." }, { status: 503 });
  }
}
