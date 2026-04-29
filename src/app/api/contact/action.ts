"use server";

import { Resend } from "resend";
import { z } from "zod";
import { getSiteSettings } from "@/db/queries";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
  rgpd: z.literal(true),
  honeypot: z.string().max(0),
});

const rateLimitMap = new Map<string, number>();

export async function sendContactEmail(
  data: z.infer<typeof contactSchema>
): Promise<{ success: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Données invalides." };
  }

  if (parsed.data.honeypot) {
    return { success: true };
  }

  const now = Date.now();
  const key = parsed.data.email;
  const lastSent = rateLimitMap.get(key);
  if (lastSent && now - lastSent < 60_000) {
    return {
      success: false,
      error: "Veuillez attendre avant d'envoyer un autre message.",
    };
  }
  rateLimitMap.set(key, now);

  try {
    const settings = await getSiteSettings();
    const contactEmail = settings?.contactEmail || settings?.email || "info@physio-vertige.ch";

    await resend.emails.send({
      from: "Physio-Vertige <onboarding@resend.dev>",
      to: contactEmail,
      replyTo: parsed.data.email,
      subject: `[Contact] ${parsed.data.subject}`,
      text: `Nouveau message de contact\n\nNom: ${parsed.data.name}\nEmail: ${parsed.data.email}\nTéléphone: ${parsed.data.phone || "Non renseigné"}\nSujet: ${parsed.data.subject}\n\nMessage:\n${parsed.data.message}`,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de l'envoi de l'email." };
  }
}
