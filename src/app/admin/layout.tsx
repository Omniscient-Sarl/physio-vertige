import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Settings,
  FileText,
  Stethoscope,
  BookOpen,
  MessageSquareQuote,
  HelpCircle,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/site-settings", label: "Paramètres", icon: Settings },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Stethoscope },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/testimonials", label: "Témoignages", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
  { href: "/admin/media", label: "Médias", icon: ImageIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="font-heading text-lg font-bold text-primary">
            Physio-Vertige
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <div className="my-2 border-t" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Voir le site
          </a>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h2 className="font-heading text-lg font-semibold lg:hidden">
            Admin
          </h2>
          <div className="ml-auto">
            <UserButton />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
    </ClerkProvider>
  );
}
