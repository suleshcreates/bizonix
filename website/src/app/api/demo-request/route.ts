import { NextRequest, NextResponse } from "next/server";
import { priorityOptions, roleOptions, timelineOptions } from "@/lib/content/contact/contact-content";

type DemoRequest = {
  fullName?: string; companyName?: string; city?: string; outletCount?: string;
  currentSoftware?: string; role?: string; priorities?: string[]; timeline?: string;
  email?: string; phone?: string; notes?: string; consent?: boolean; website?: string;
  elapsedMs?: number; utm?: Record<string, string>;
};

const attempts = new Map<string, number>();
const WINDOW_MS = 60_000;
const MIN_FILL_MS = 2_500;
const clean = (value: unknown, max = 400) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as DemoRequest;
    // Do not disclose bot defenses.
    if (clean(data.website) || (typeof data.elapsedMs === "number" && data.elapsedMs < MIN_FILL_MS)) {
      return NextResponse.json({ success: true });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (Date.now() - (attempts.get(ip) || 0) < WINDOW_MS) {
      return NextResponse.json({ error: "Please wait a minute before trying again." }, { status: 429 });
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
    attempts.set(ip, Date.now());
    return NextResponse.json({ success: true, id: result.id, message: "Your demo request has been forwarded to the Bizonix team. We will get back to you shortly." });
  } catch (error) {
    console.error("Demo request intake failed", error);
    return NextResponse.json({ error: "We could not record your request. Please try again shortly." }, { status: 503 });
  }
}
