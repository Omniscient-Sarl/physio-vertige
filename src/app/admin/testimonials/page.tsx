import { db } from "@/db/index";
import { testimonials, services } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { TestimonialsAdmin } from "./client";

export default async function AdminTestimonialsPage() {
  const all = await db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.order));

  const publishedServices = await db
    .select({ id: services.id, title: services.title })
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.order));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Temoignages</h1>
      <p className="mt-1 text-muted-foreground">
        Gerez les temoignages des patients.
      </p>
      <div className="mt-8">
        <TestimonialsAdmin
          testimonials={all}
          services={publishedServices}
        />
      </div>
    </div>
  );
}
