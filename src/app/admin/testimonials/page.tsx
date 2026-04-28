import { db } from "@/db/index";
import { testimonials } from "@/db/schema";
import { asc } from "drizzle-orm";
import { TestimonialsAdmin } from "./client";

export default async function AdminTestimonialsPage() {
  const all = await db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.order));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Témoignages</h1>
      <p className="mt-1 text-muted-foreground">
        Gérez les témoignages des patients.
      </p>
      <div className="mt-8">
        <TestimonialsAdmin testimonials={all} />
      </div>
    </div>
  );
}
