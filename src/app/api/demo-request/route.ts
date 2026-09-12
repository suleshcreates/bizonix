import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  priorityOptions,
  roleOptions,
  timelineOptions,
} from "@/lib/content/contact/contact-content";

type DemoRequest = {
  fullName?: string;
  companyName?: string;
  city?: string;
  outletCount?: string;
  currentSoftware?: string;
  role?: string;
  priorities?: string[];
  timeline?: string;
  email?: string;
  phone?: string;
  notes?: string;
  consent?: boolean;
  website?: string;
  elapsedMs?: number;
  utm?: Record<string, string>;
};

const attempts = new Map<string, number>();
const WINDOW_MS = 60_000;
const MIN_FILL_MS = 2_500;

const clean = (value: unknown, max = 400) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const label = <T extends { value: string; label: string }>(
  options: readonly T[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? value;

/**
 * Lead score routes follow-up priority.
 *   Decision-maker role   +30 (founder/finance)
 *   This-quarter timeline +40
 *   More than one priority +15
 *   Phone number given    +10 (opens the fastest channel)
 * Kept server-side so the weighting is not visible to form-fillers.
 */
function scoreLead(
  role: string,
  timeline: string,
  priorities: string[],
  phone: string,
) {
  const roleWeight =
    roleOptions.find((option) => option.value === role)?.weight ?? 0;
  const timelineWeight =
    timelineOptions.find((option) => option.value === timeline)?.weight ?? 0;
  const breadth = priorities.length > 1 ? 15 : 0;
  const reachable = phone ? 10 : 0;
  return Math.min(100, roleWeight + timelineWeight + breadth + reachable);
}

function priorityOf(score: number): "high" | "medium" | "low" {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

async function notifySlack(
  summary: string,
  urgency: "high" | "medium" | "low",
) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;
  const icon = urgency === "high" ? "🔴" : urgency === "medium" ? "🟠" : "⚪";
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `${icon} *New Bizonix demo request*\n${summary}`,
      }),
    });
  } catch (error) {
    // Slack is a convenience channel; never fail the lead because it is down.
    console.error("Slack notification failed", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.NEXT_PUBLIC_DEMO_REQUESTS_ENABLED !== "true") {
      return NextResponse.json(
        { error: "Demo requests are not available through this site yet." },
        { status: 503 },
      );
    }
    const data = (await request.json()) as DemoRequest;

    // Honeypot and speed traps return success so bots do not learn the rule.
    if (clean(data.website)) return NextResponse.json({ success: true });
    if (typeof data.elapsedMs === "number" && data.elapsedMs < MIN_FILL_MS) {
      return NextResponse.json({ success: true });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const last = attempts.get(ip) || 0;
    if (Date.now() - last < WINDOW_MS) {
      return NextResponse.json(
        { error: "Please wait a minute before trying again." },
        { status: 429 },
      );
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
    const notes = clean(data.notes, 2000);
    const priorities = Array.isArray(data.priorities)
      ? data.priorities
          .map((value) => clean(value, 60))
          .filter((value) =>
            priorityOptions.some((option) => option.value === value),
          )
          .slice(0, 2)
      : [];

    const validRole = roleOptions.some((option) => option.value === role);
    const validTimeline = timelineOptions.some(
      (option) => option.value === timeline,
    );
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validPhone = /^[+\d][\d\s-]{7,17}$/.test(phone);

    if (
      !fullName ||
      !companyName ||
      !city ||
      !outletCount ||
      !currentSoftware ||
      !validRole ||
      !validTimeline ||
      !validEmail ||
      !validPhone ||
      priorities.length === 0 ||
      !data.consent
    ) {
      return NextResponse.json(
        { error: "Please check the required fields." },
        { status: 400 },
      );
    }

    const score = scoreLead(role, timeline, priorities, phone);
    const urgency = priorityOf(score);

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.DEMO_REQUEST_TO_EMAIL;
    const from = process.env.DEMO_REQUEST_FROM_EMAIL;

    const details: [string, string][] = [
      ["Name", fullName],
      ["Company", companyName],
      ["City", city],
      ["Outlet count", outletCount],
      ["Current software", currentSoftware],
      ["Role", label(roleOptions, role)],
      [
        "Priorities",
        priorities.map((value) => label(priorityOptions, value)).join(", "),
      ],
      ["Timeline", label(timelineOptions, timeline)],
      ["Email", email],
      ["Phone", phone],
      ["Notes", notes || "Not provided"],
      ["Lead score", `${score} (${urgency} priority)`],
      ["Source", data.utm?.utm_source || "direct"],
      ["Campaign", data.utm?.utm_campaign || "none"],
    ];
    const summary = details
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    if (!apiKey || !to || !from) {
      // Email delivery unconfigured: still record the lead where we can, and be
      // honest with the visitor rather than pretending it was received.
      await notifySlack(summary, urgency);
      console.warn("Demo request received but email delivery is unconfigured", {
        companyName,
        score,
      });
      return NextResponse.json(
        {
          error:
            "We could not record your request automatically. Please try again once demo request delivery has been configured.",
        },
        { status: 503 },
      );
    }

    attempts.set(ip, Date.now());
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `${urgency === "high" ? "[HIGH] " : ""}Bizonix demo request — ${companyName}`,
      text: summary,
    });
    if (error) throw new Error(error.message);

    await notifySlack(summary, urgency);
    return NextResponse.json({ success: true, priority: urgency });
  } catch (error) {
    console.error("Demo request failed", error);
    return NextResponse.json(
      { error: "We couldn't send your request. Please try WhatsApp instead." },
      { status: 500 },
    );
  }
}
