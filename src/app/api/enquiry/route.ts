import { NextResponse, type NextRequest } from "next/server";
import { MIN_FILL_MS, normaliseEnquiry, validateEnquiry } from "@/lib/enquiry";
import { mailerConfigured, sendEnquiryEmail } from "@/lib/server/mailer";
import { rateLimit } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { site } from "@/lib/site";

const UNAVAILABLE = `Online enquiries are not available right now. Please email ${site.email} or call ${site.phones[0].display}.`;

function clientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
}

export async function POST(request: NextRequest) {
  // Reject cross-site submissions.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ ok: false, message: "Request not allowed." }, { status: 403 });
  }

  const ip = clientIp(request);
  if (!rateLimit(`enquiry:${ip ?? "unknown"}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, message: "Too many enquiries from this connection. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("bad body");
  } catch {
    return NextResponse.json({ ok: false, message: "The form could not be read. Please try again." }, { status: 400 });
  }

  // Bot checks: hidden honeypot field and an implausibly fast submission.
  // Bots are given a normal-looking success so they do not adapt.
  const honeypot = typeof raw.website === "string" ? raw.website : "";
  const startedAt = Number(raw.startedAt);
  const tooFast = !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS;
  if (honeypot || tooFast) {
    return NextResponse.json({ ok: true });
  }

  const enquiry = normaliseEnquiry(raw);
  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, message: "Please correct the highlighted fields.", errors },
      { status: 422 },
    );
  }

  const token = typeof raw.turnstileToken === "string" ? raw.turnstileToken : "";
  if (!(await verifyTurnstile(token, ip))) {
    return NextResponse.json(
      { ok: false, message: "The security check did not complete. Please try again." },
      { status: 400 },
    );
  }

  if (!mailerConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[enquiry] SMTP not configured; enquiry received in development:", enquiry);
      return NextResponse.json({ ok: true });
    }
    console.error("[enquiry] SMTP is not configured; enquiry could not be delivered.");
    return NextResponse.json({ ok: false, message: UNAVAILABLE }, { status: 503 });
  }

  try {
    await sendEnquiryEmail(enquiry);
  } catch (error) {
    console.error("[enquiry] Failed to send enquiry email:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, message: UNAVAILABLE }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
