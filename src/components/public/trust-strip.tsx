import { ShieldCheck, Users, Award, Clock } from "lucide-react";

const stats = [
  { icon: Clock, value: "10+", label: "Ans d'expérience" },
  { icon: Users, value: "1 000+", label: "Patients traités" },
  { icon: ShieldCheck, value: "RCC", label: "Conventionné LAMal" },
  { icon: Award, value: "1-3", label: "Séances pour VPPB" },
];

export function TrustStrip() {
  return (
    <div className="border-y border-border/60 bg-sand-50">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
