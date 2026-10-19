import "server-only";
import nodemailer from "nodemailer";
import type { EnquiryInput } from "@/lib/enquiry";
import { site } from "@/lib/site";

export function mailerConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strips characters that could break out of an email header. */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").slice(0, 200);
}

export async function sendEnquiryEmail(enquiry: EnquiryInput): Promise<void> {
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Company", enquiry.company || "Not given"],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone || "Not given"],
    ["Sector", enquiry.sector || "Not given"],
  ];

  const textBody = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Requirement:",
    enquiry.message,
    "",
    `Sent from the enquiry form on ${site.url}`,
  ].join("\n");

  const htmlBody = `
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><th align="left" style="border-bottom:1px solid #ddd">${k}</th><td style="border-bottom:1px solid #ddd">${escapeHtml(v)}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px"><strong>Requirement</strong></p>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#666">Sent from the enquiry form on ${escapeHtml(site.url)}</p>`;

  await transporter.sendMail({
    from: { name: `${site.name} website`, address: process.env.ENQUIRY_FROM || (process.env.SMTP_USER as string) },
    to: process.env.ENQUIRY_TO || site.email,
    replyTo: { name: headerSafe(enquiry.name), address: enquiry.email },
    subject: headerSafe(`Website enquiry from ${enquiry.name}${enquiry.company ? `, ${enquiry.company}` : ""}`),
    text: textBody,
    html: htmlBody,
  });
}
