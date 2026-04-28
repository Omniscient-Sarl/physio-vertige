"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string; level: number };

export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="sticky top-24" aria-label="Table des matières">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Sommaire
      </p>
      <ul className="space-y-2 border-l border-border pl-4">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block text-sm leading-snug transition-colors ${
                activeId === h.id
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground"
              } ${h.level === 3 ? "ml-3" : ""}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
