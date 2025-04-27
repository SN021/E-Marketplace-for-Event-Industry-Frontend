import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ServicePageClient from "./components/ServicePageClient";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: { serviceId: string };
}) {
  const headersList = headers(); // ❗ No await needed here
  const protocol = (await headersList).get("x-forwarded-proto") || "http";
  const { serviceId } = params;
  const host = (await headersList).get("host");
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/get-service-by-id?id=${serviceId}`, {
    headers: {
      cookie: (await headersList).get("cookie") || "",
    },
    cache: "no-store",
  });

  if (!res.ok) return notFound();
  const data = await res.json();
  if (!data || data.error) return notFound();

  return <ServicePageClient data={data} />;
}
