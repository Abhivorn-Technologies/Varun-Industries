"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = ".section .container > *, .cta-band__inner > *, .page-header .container > *, [data-reveal]";

/**
 * Fades content up as it scrolls into view. Content is only hidden once this
 * script is running (via the `reveal-ready` class on <html>), so the page is
 * fully readable without JavaScript, and nothing animates for visitors who
 * prefer reduced motion.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
      (el) => !el.dataset.revealed,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.dataset.revealed = "true";
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const viewportHeight = window.innerHeight;
    targets.forEach((el, index) => {
      // Content already on screen stays put; only content below the fold animates in.
      if (el.getBoundingClientRect().top < viewportHeight) {
        el.dataset.revealed = "true";
        return;
      }
      // Stagger siblings slightly so grouped items arrive in sequence.
      el.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
      el.dataset.reveal = el.dataset.reveal ?? "";
      observer.observe(el);
    });
    root.classList.add("reveal-ready");

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
