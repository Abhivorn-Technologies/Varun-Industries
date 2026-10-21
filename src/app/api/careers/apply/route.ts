import { NextResponse, type NextRequest } from "next/server";
import { mailerConfigured, sendCareerApplicationEmail } from "@/lib/server/mailer";
import { rateLimit } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { site } from "@/lib/site";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const MIN_FILL_MS = 2500;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[+0-9\s\-()]{7,20}$/;

const ALLOWED_POSITIONS = [
  "CNC Operator / Machinist",
  "Quality Control",
  "Production / Manufacturing",
  "Maintenance Technician",
  "Other",
];

const ALLOWED_EXPERIENCE = ["Fresher", "1–2 years", "3–5 years", "6+ years"];

function clientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
}

export async function POST(request: NextRequest) {
  // 1. Cross-site protection
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ ok: false, message: "Request not allowed." }, { status: 403 });
  }

  // 2. IP rate limiting
  const ip = clientIp(request);
  if (!rateLimit(`careers:${ip ?? "unknown"}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, message: "Too many submissions from this connection. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  // 3. Read multipart/form-data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, message: "The application could not be read. Please try again." },
      { status: 400 },
    );
  }

  // 4. Honeypot & timing checks for bots
  const honeypot = String(formData.get("website") || "");
  const startedAt = Number(formData.get("startedAt"));
  const tooFast = !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS;
  if (honeypot || tooFast) {
    return NextResponse.json({ ok: true, reference: "APP-" + Date.now().toString(36).toUpperCase() });
  }

  // 5. Extract form fields
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const position = String(formData.get("position") || "").trim();
  const otherPosition = String(formData.get("otherPosition") || "").trim();
  const experience = String(formData.get("experience") || "").trim();
  const skills = String(formData.get("skills") || "").trim().slice(0, 500);
  const message = String(formData.get("message") || "").trim().slice(0, 3000);
  const consent = formData.get("consent") === "on" || formData.get("consent") === "true";
  const resume = formData.get("resume");

  // 6. Validation
  const errors: Record<string, string> = {};

  if (!fullName || fullName.length < 2) {
    errors.fullName = "Please enter your full name.";
  } else if (fullName.length > 100) {
    errors.fullName = "Name cannot exceed 100 characters.";
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  } else if (email.length > 120) {
    errors.email = "Email cannot exceed 120 characters.";
  }

  if (!phone || !PHONE_REGEX.test(phone) || phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!position || !ALLOWED_POSITIONS.includes(position)) {
    errors.position = "Please select the position you are applying for.";
  } else if (position === "Other" && (!otherPosition || otherPosition.length < 2)) {
    errors.otherPosition = "Please specify the desired position.";
  }

  if (!experience || !ALLOWED_EXPERIENCE.includes(experience)) {
    errors.experience = "Please select your experience level.";
  }

  let resumeBuffer: Buffer | undefined;
  let resumeFilename = "";

  if (!resume || !(resume instanceof File) || resume.size === 0) {
    errors.resume = "Please upload your resume in PDF format.";
  } else {
    const isPdf =
      resume.type === "application/pdf" ||
      resume.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      errors.resume = "Resume must be a PDF document.";
    } else if (resume.size > MAX_FILE_BYTES) {
      errors.resume = `Resume file is too large (${(resume.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed is 5 MB.`;
    } else {
      resumeFilename = resume.name;
      try {
        const arrayBuffer = await resume.arrayBuffer();
        resumeBuffer = Buffer.from(arrayBuffer);
      } catch {
        errors.resume = "Could not read the uploaded file. Please select it again.";
      }
    }
  }

  if (!consent) {
    errors.consent = "You must agree to the privacy policy to submit your application.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, message: "Please correct the highlighted fields.", errors },
      { status: 422 },
    );
  }

  // 7. Security token check
  const token = String(formData.get("turnstileToken") || "");
  if (!(await verifyTurnstile(token, ip))) {
    return NextResponse.json(
      { ok: false, message: "The security check did not complete. Please try again." },
      { status: 400 },
    );
  }

  const finalPosition = position === "Other" ? `Other (${otherPosition})` : position;
  const reference = "APP-" + Date.now().toString(36).toUpperCase();

  const applicationPayload = {
    fullName,
    email,
    phone,
    position: finalPosition,
    experience,
    skills: skills || undefined,
    message: message || undefined,
    resumeFile: resumeBuffer
      ? {
          filename: resumeFilename,
          buffer: resumeBuffer,
        }
      : undefined,
  };

  // 8. Delivery
  if (!mailerConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[career-application] SMTP not configured; application received in development:", {
        reference,
        candidate: fullName,
        email,
        phone,
        position: finalPosition,
        experience,
        resumeName: resumeFilename,
        resumeSize: resumeBuffer?.length,
      });
      return NextResponse.json({ ok: true, reference });
    }
    console.error("[career-application] SMTP is not configured; application could not be delivered.");
    return NextResponse.json(
      {
        ok: false,
        message: `Online applications are temporarily unavailable. Please email your resume to ${site.email} or call ${site.phones[0].display}.`,
      },
      { status: 503 },
    );
  }

  try {
    await sendCareerApplicationEmail(applicationPayload);
  } catch (error) {
    console.error(
      "[career-application] Failed to send email:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        ok: false,
        message: `Could not send application right now. Please email your resume directly to ${site.email}.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, reference });
}
