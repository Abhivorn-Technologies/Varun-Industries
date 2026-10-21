"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = [
  // Hero section elements
  "[class*='Hero_content'] > *",
  "[class*='hero'] [class*='content'] > *",
  "[class*='Hero_galleryHead']",
  "[class*='Hero_marquee']",
  
  // Page headers (inner pages)
  ".page-header .container > *",
  
  // Section headers & titles
  ".section-head > *",
  
  // Split layouts and columns
  ".split > *",
  "[class*='layout'] > *",
  "[class*='formColumn'] > *",
  "[class*='details']",
  
  // Lists and process steps
  ".process-list > li",
  ".spec-list > li",
  ".spec-table tbody tr",
  ".tick-list > li",
  ".steps > li",
  ".values > li",
  
  // Gallery and figure items
  ".gallery > .figure",
  ".figure",
  
  // Sectors & CTA band
  ".sectors__inner",
  ".cta-band__inner > *",
  
  // Footer
  ".footer .grid > *",
  ".footer .bottom",
  
  // Prose text blocks (About, legal)
  ".prose > p",
  ".prose > h2",
  ".prose > h3",
  ".prose > ul",
  
  // Explicit attribute
  "[data-reveal]",
].join(", ");

/**
 * Runs smooth float-up entrance animations on page load/refresh,
 * and continuously on scroll (both scrolling down and scrolling up).
 * Off-screen elements reset cleanly so re-entering the viewport
 * triggers the animation again.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));

    targets.forEach((el) => {
      el.dataset.reveal = "";
      delete el.dataset.revealed;

      // Calculate stagger within parent container
      const parent = el.parentElement;
      let siblingIndex = 0;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (c) => c.hasAttribute("data-reveal") || c.matches(SELECTOR)
        );
        siblingIndex = siblings.indexOf(el);
      }
      const delay = Math.max(0, Math.min(siblingIndex >= 0 ? siblingIndex : 0, 5) * 70);
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    root.classList.add("reveal-ready");
    // Force style flush so browser computes initial opacity: 0 and translateY(24px)
    void root.offsetHeight;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            // Animate in when entering viewport (scrolling down, scrolling up, or on refresh)
            el.dataset.revealed = "true";
          } else {
            // Reset when safely beyond viewport edges so it can re-animate when scrolled back
            const rect = entry.boundingClientRect;
            const isOutside =
              rect.bottom < -20 || rect.top > window.innerHeight + 20;
            if (isOutside) {
              delete el.dataset.revealed;
            }
          }
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    requestAnimationFrame(() => {
      targets.forEach((el) => observer.observe(el));
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
