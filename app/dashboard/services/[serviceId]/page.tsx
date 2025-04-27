import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ServicePageClient from "./components/ServicePageClient";

export const dynamic = "force-dynamic";

export default async function Page(
  props: { params: Promise<{ serviceId: string }> }
) {
  // 1. Await the async params
  const { serviceId } = await props.params;

  // 2. Call headers() synchronously
  const hdrs     = await headers();
  const protocol = hdrs.get("x-forwarded-proto") || "http";
  const host     = hdrs.get("host");
  const baseUrl  = `${protocol}://${host}`;

  // 3. Fetch your data
  const res = await fetch(
    `${baseUrl}/api/get-service-by-id?id=${serviceId}`,
    {
      headers: { cookie: hdrs.get("cookie") || "" },
      cache: "no-store",
    }
  );
  if (!res.ok) return notFound();

  const data = await res.json();
  if (!data || data.error) return notFound();

  // 4. Render client component with fetched data
  return <ServicePageClient data={data} />;
}
