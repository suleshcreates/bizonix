import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

type DemoRequest = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  city?: string;
  industry?: string;
  companySize?: string;
  message?: string;
  consent?: boolean;
  website?: string;
};
const attempts = new Map<string, number>();
const WINDOW_MS = 60_000;
const clean = (value: unknown) =>
  typeof value === "string" ? value.trim().slice(0, 2000) : "";

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as DemoRequest;
    if (clean(data.website)) return NextResponse.json({ success: true });
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const last = attempts.get(ip) || 0;
    if (Date.now() - last < WINDOW_MS)
      return NextResponse.json(
        { error: "Please wait a minute before trying again." },
        { status: 429 },
      );
    const name = clean(data.name),
      company = clean(data.company),
      phone = clean(data.phone),
      email = clean(data.email);
    if (
      !name ||
      !company ||
      !phone ||
      !data.consent ||
      !/^[+\d][\d\s-]{7,17}$/.test(phone) ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    )
      return NextResponse.json(
        { error: "Please check the required fields." },
        { status: 400 },
      );
    const apiKey = process.env.RESEND_API_KEY,
      to = process.env.DEMO_REQUEST_TO_EMAIL,
      from = process.env.DEMO_REQUEST_FROM_EMAIL;
    if (!apiKey || !to || !from)
      return NextResponse.json(
        {
          error:
            "Demo email delivery is not configured yet. Please use the WhatsApp option.",
        },
        { status: 500 },
      );
    attempts.set(ip, Date.now());
    const resend = new Resend(apiKey);
    const details = [
      ["Name", name],
      ["Company", company],
      ["Phone", phone],
      ["Email", email || "Not provided"],
      ["City", clean(data.city) || "Not provided"],
      ["Industry", clean(data.industry) || "Not provided"],
      ["Company size", clean(data.companySize) || "Not provided"],
      ["Message", clean(data.message) || "Not provided"],
    ];
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Bizonix demo request — ${company}`,
      text: details.map(([k, v]) => `${k}: ${v}`).join("\n"),
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Demo request failed", error);
    return NextResponse.json(
      { error: "We couldn't send your request. Please try WhatsApp instead." },
      { status: 500 },
    );
  }
}
