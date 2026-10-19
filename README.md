# Varun Industries website

Marketing website for Varun Industries, a CNC precision machining company in Hyderabad.
Built with Next.js 16 (App Router) and TypeScript. No database, no CMS, no paid services.

## Pages

| Path | Content |
| --- | --- |
| `/` | Home: overview, in-house machining, coordinated processes, how we work, component photos |
| `/about` | About Us, principles, Vision, Mission (client-supplied text) |
| `/capabilities` | In-house services, equipment, vendor network, inspection and documentation |
| `/components` | Photographs of machined components |
| `/contact` | Enquiry form ("Request a quote") and contact details |
| `/privacy-policy`, `/terms-and-conditions` | Legal pages |
| any unknown URL | Custom 404 page |

Company details (phones, email, address, machines, processes) live in one place: `src/lib/site.ts`.
Photo captions and alt text live in `src/lib/photos.ts`.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Quality checks (run before every deployment):

```bash
npm run check   # eslint + TypeScript + production build
```

## Environment variables

See `.env.example`. Only variables starting with `NEXT_PUBLIC_` reach the browser; SMTP and
Turnstile secrets stay on the server.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Live URL, e.g. `https://www.varunindustries.in`. Used for canonical URLs, sitemap, social previews. Set before building. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Yes, for the form | Email delivery for enquiries. For Gmail: `smtp.gmail.com`, `465`, `true`, the Gmail address, and a Google App Password (needs 2-step verification). |
| `ENQUIRY_TO` | No | Inbox for enquiries. Defaults to varunindustries2013@gmail.com. |
| `ENQUIRY_FROM` | No | Sender address. Defaults to `SMTP_USER`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile bot check on the form (free). |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4. When set, the cookie consent banner appears and analytics loads only after the visitor accepts. |

If SMTP is not configured in production, the form tells visitors to email or call instead of
pretending to succeed.

## Contact form protection

- Same validation rules in the browser and on the server (`src/lib/enquiry.ts`).
- Hidden honeypot field and a minimum fill time; bot submissions are silently dropped.
- Rate limit of 5 submissions per 10 minutes per IP (in memory, per server instance).
- Cross-origin submissions rejected.
- Optional Cloudflare Turnstile.

## Security and HTTPS

- Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) in `next.config.ts`.
  The CSP only allows Google or Cloudflare origins when those features are configured.
- `src/proxy.ts` redirects HTTP to HTTPS in production when the host forwards `x-forwarded-proto`.
  Most hosts (Vercel, Netlify, Cloudflare) also force HTTPS themselves.

## SEO

Per-page titles, descriptions, canonical URLs and Open Graph/Twitter tags; `sitemap.xml`,
`robots.txt`, web manifest, favicon/app icons (`src/app/icon.png`, `apple-icon.png`, `favicon.ico`),
social preview image (`public/og-image.jpg`) and LocalBusiness structured data.

## Deploying

Any Node.js host works. On Vercel: import the project, set the environment variables above,
deploy, then add the custom domain under Project → Domains and point DNS as instructed.
After the domain is live, submit `https://<domain>/sitemap.xml` in Google Search Console.

## Updating content

- Text: edit the page files in `src/app/**/page.tsx`; company details in `src/lib/site.ts`.
- Photos: add a JPEG (max ~1600 px on the long edge) to `public/images/parts/`, import it in
  `src/lib/photos.ts` with descriptive alt text and a caption, and add it to `galleryOrder`.
- Legal pages: update the `LAST_UPDATED` date when changing them.
