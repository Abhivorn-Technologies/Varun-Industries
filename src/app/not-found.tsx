import type { Metadata } from "next";
import Link from "next/link";
import { navigation } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container prose">
        <p className="not-found__code">Error 404</p>
        <h1>This page could not be found</h1>
        <p className="lead">The link may be out of date, or the address may have been typed incorrectly.</p>
        <p>These pages may help:</p>
        <ul>
          {navigation.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <p>
          <Link href="/" className="btn btn--primary">
            Go to the home page
          </Link>
        </p>
      </div>
    </section>
  );
}
