import { Info, AlertTriangle, Lightbulb, Stethoscope } from "lucide-react";

const variants = {
  info: {
    icon: Info,
    bg: "bg-primary/5",
    border: "border-primary/20",
    iconColor: "text-primary",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-destructive/5",
    border: "border-destructive/20",
    iconColor: "text-destructive",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-coral-500/5",
    border: "border-coral-500/20",
    iconColor: "text-coral-500",
  },
  consult: {
    icon: Stethoscope,
    bg: "bg-primary/5",
    border: "border-primary/20",
    iconColor: "text-primary",
  },
};

type Props = {
  variant?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
};

export function Callout({ variant = "info", title, children }: Props) {
  const v = variants[variant];
  const Icon = v.icon;

  return (
    <div
      className={`my-6 rounded-xl border ${v.border} ${v.bg} p-5`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${v.iconColor}`} />
        <div className="min-w-0">
          {title && (
            <p className="mb-1 font-heading text-sm font-semibold text-foreground">
              {title}
            </p>
          )}
          <div className="text-sm leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
