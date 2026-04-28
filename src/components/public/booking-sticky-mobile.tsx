"use client";

import { Phone } from "lucide-react";

export function BookingStickyMobile() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background p-3 shadow-lg md:hidden">
      <a
        href="tel:+41772747144"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
      >
        <Phone className="h-4 w-4" />
        Prendre rendez-vous
      </a>
    </div>
  );
}
