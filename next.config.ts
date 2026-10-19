import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

// Third-party origins are only allowed when the matching feature is configured.
const scriptSrc = ["'self'", "'unsafe-inline'"];
const connectSrc = ["'self'"];
const imgSrc = ["'self'", "data:", "blob:"];
const frameSrc: string[] = [];

if (isDev) scriptSrc.push("'unsafe-eval'");
if (analyticsEnabled) {
  scriptSrc.push("https://www.googletagmanager.com");
  connectSrc.push(
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://www.googletagmanager.com",
  );
  imgSrc.push("https://*.google-analytics.com", "https://www.googletagmanager.com");
}
if (turnstileEnabled) {
  scriptSrc.push("https://challenges.cloudflare.com");
  connectSrc.push("https://challenges.cloudflare.com");
  frameSrc.push("https://challenges.cloudflare.com");
}

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src ${imgSrc.join(" ")}`,
  "font-src 'self'",
  `connect-src ${connectSrc.join(" ")}`,
  `frame-src ${frameSrc.length ? frameSrc.join(" ") : "'none'"}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
