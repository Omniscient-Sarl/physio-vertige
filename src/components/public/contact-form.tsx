"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendContactEmail } from "@/app/api/contact/action";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  rgpd: z.literal(true, {
    error: "Vous devez accepter la politique de confidentialité",
  }),
  honeypot: z.string().max(0),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { honeypot: "" },
  });

  async function onSubmit(data: ContactFormData) {
    setPending(true);
    try {
      const result = await sendContactEmail(data);
      if (result.success) {
        toast.success("Message envoyé avec succès !");
        reset();
      } else {
        toast.error(result.error || "Erreur lors de l'envoi du message.");
      }
    } catch {
      toast.error("Erreur lors de l'envoi du message.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" {...register("honeypot")} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom *</Label>
          <Input id="name" {...register("name")} className="mt-1" />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} className="mt-1" />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" type="tel" {...register("phone")} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="subject">Sujet *</Label>
          <Input id="subject" {...register("subject")} className="mt-1" />
          {errors.subject && (
            <p className="mt-1 text-sm text-destructive">{errors.subject.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" rows={5} {...register("message")} className="mt-1" />
        {errors.message && (
          <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="rgpd"
          {...register("rgpd")}
          className="mt-1 h-4 w-4 rounded border-border"
        />
        <Label htmlFor="rgpd" className="text-sm font-normal text-muted-foreground">
          J&apos;accepte que mes données soient utilisées pour me recontacter. Voir la{" "}
          <a href="/politique-de-confidentialite" className="underline hover:text-foreground">
            politique de confidentialité
          </a>
          .
        </Label>
      </div>
      {errors.rgpd && (
        <p className="text-sm text-destructive">{errors.rgpd.message}</p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </form>
  );
}
