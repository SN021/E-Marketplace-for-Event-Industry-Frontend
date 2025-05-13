import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ServicePageClient from "./components/ServicePageClient";

export const dynamic = "force-dynamic";

export default async function Page(
  props: { params: Promise<{ serviceId: string }> }
) {
  const { serviceId } = await props.params;

  const hdrs     = await headers();
  const protocol = hdrs.get("x-forwarded-proto") || "http";
  const host     = hdrs.get("host");
  const baseUrl  = `${protocol}://${host}`;

  const res = await fetch(
    `${baseUrl}/api/services/get-service-by-id?id=${serviceId}`,
    {
      headers: { cookie: hdrs.get("cookie") || "" },
      cache: "no-store",
    }
  );
  if (!res.ok) return notFound();

  const data = await res.json();
  if (!data || data.error) return notFound();
  

  return <ServicePageClient data={data} />;
}
