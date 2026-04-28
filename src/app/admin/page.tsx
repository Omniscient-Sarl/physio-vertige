import Link from "next/link";
import {
  FileText,
  Stethoscope,
  BookOpen,
  MessageSquareQuote,
  HelpCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const cards = [
  { href: "/admin/pages", label: "Pages", icon: FileText, description: "Gérer les pages du site" },
  { href: "/admin/services", label: "Services", icon: Stethoscope, description: "Vertiges traités" },
  { href: "/admin/blog", label: "Blog", icon: BookOpen, description: "Articles et actualités" },
  { href: "/admin/testimonials", label: "Témoignages", icon: MessageSquareQuote, description: "Avis des patients" },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle, description: "Questions fréquentes" },
  { href: "/admin/media", label: "Médias", icon: ImageIcon, description: "Bibliothèque de médias" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-1 text-muted-foreground">
        Bienvenue dans l&apos;espace d&apos;administration de Physio-Vertige.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-lg bg-primary/10 p-3">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold group-hover:text-primary">
                    {card.label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
