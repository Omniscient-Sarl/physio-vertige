"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Service = { slug: string; title: string };

type Props = {
  phone: string;
  services: Service[];
};

const navLinks = [
  { href: "/le-physiotherapeute", label: "Le physiotherapeute" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header({ phone, services }: Props) {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const phoneTel = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-xl font-bold text-primary"
        >
          Physio-Vertige
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navigation principale"
        >
          {/* Mega-menu: Vertiges traites */}
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <Link
              href="/vertiges-traites"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Vertiges traites
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            {megaOpen && (
              <div className="absolute left-1/2 top-full z-50 w-[520px] -translate-x-1/2 pt-2">
                <div className="rounded-xl border border-border/60 bg-card p-5 shadow-lg">
                  <div className="grid grid-cols-2 gap-1">
                    {services.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/vertiges-traites/${c.slug}`}
                        className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        onClick={() => setMegaOpen(false)}
                      >
                        {c.title}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 border-t pt-3">
                    <Link
                      href="/vertiges-traites"
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      onClick={() => setMegaOpen(false)}
                    >
                      Voir toutes les conditions
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <a
            href={phoneTel}
            className={cn(buttonVariants({ size: "sm" }), "ml-3")}
          >
            <Phone className="mr-2 h-4 w-4" />
            Prendre rendez-vous
          </a>
        </nav>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Ouvrir le menu"
              />
            }
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
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <nav className="mt-8 flex flex-col gap-1">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vertiges traites
              </p>
              {services.map((c) => (
                <Link
                  key={c.slug}
                  href={`/vertiges-traites/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent"
                >
                  {c.title}
                </Link>
              ))}

              <div className="my-4 border-t" />

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}

              <a
                href={phoneTel}
                className={cn(buttonVariants(), "mt-6")}
              >
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
