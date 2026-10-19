"use client";

import Link from "next/link";
import { site } from "@/lib/site";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="not-found">
      <div className="container prose">
        <p className="not-found__code">Something went wrong</p>
        <h1>This page could not be loaded</h1>
        <p className="lead">
          Please try again. If the problem continues, contact us on{" "}
          <a href={`tel:${site.phones[0].tel}`}>{site.phones[0].display}</a> or{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <p>
          <button type="button" className="btn btn--primary" onClick={reset}>
            Try again
          </button>{" "}
          <Link href="/" className="btn btn--outline">
            Go to the home page
          </Link>
        </p>
      </div>
    </section>
  );
}
