import { db } from "@/db/index";
import { faqs, services } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { FaqsAdmin } from "./client";

export default async function AdminFaqsPage() {
  const all = await db.select().from(faqs).orderBy(asc(faqs.order));

  const publishedServices = await db
    .select({ id: services.id, title: services.title })
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.order));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">FAQ</h1>
      <p className="mt-1 text-muted-foreground">
        Gerez les questions frequentes.
      </p>
      <div className="mt-8">
        <FaqsAdmin faqs={all} services={publishedServices} />
      </div>
    </div>
  );
}
