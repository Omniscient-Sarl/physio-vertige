import { db } from "@/db/index";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ServicesAdmin } from "./client";

export default async function AdminServicesPage() {
  const allServices = await db
    .select()
    .from(services)
    .orderBy(asc(services.order));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Services</h1>
      <p className="mt-1 text-muted-foreground">
        Gérez les vertiges traités et les services proposés.
      </p>
      <div className="mt-8">
        <ServicesAdmin services={allServices} />
      </div>
    </div>
  );
}
