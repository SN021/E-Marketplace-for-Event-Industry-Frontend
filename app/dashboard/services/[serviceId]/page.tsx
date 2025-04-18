import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { serviceId: string };
}) {
  const serviceId = params.serviceId;

  const res = await fetch(
    `${process.env.SITE_URL || "http://localhost:3000"}/api/get-service-by-id?id=${serviceId}`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();

  const data = await res.json();

  if (!data || data.error) return notFound();

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{data.service_title}</h1>
      <p className="text-gray-600">{data.display_name} — {data.starting_price} LKR</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {data.photo_gallery?.map((url: string, index: number) => (
          <img
            key={index}
            src={url}
            alt={`Photo ${index + 1}`}
            className="w-full rounded-xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}
