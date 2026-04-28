"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/vertiges-traites", label: "Vertiges traités" },
  { href: "/le-physiotherapeute", label: "Le physiothérapeute" },
  { href: "/blog", label: "Blog" },
  { href: "/cabinet", label: "Cabinet" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-heading text-xl font-bold text-primary">
          Physio-Vertige
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:+41772747144" className={cn(buttonVariants({ size: "sm" }))}>
            <Phone className="mr-2 h-4 w-4" />
            Prendre rendez-vous
          </a>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" aria-label="Ouvrir le menu" />}
            className="md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <a href="tel:+41772747144" className={cn(buttonVariants(), "mt-4")}>
                <Phone className="mr-2 h-4 w-4" />
                Prendre rendez-vous
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
