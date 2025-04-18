// app/dashboard/services/[serviceId]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: {
    serviceId: string;
  };
};

const fetchServiceDetails = async (id: string) => {
  const res = await fetch(`${process.env.SITE_URL || "http://localhost:3000"}/api/get-service-by-id?id=${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
};

export default async function ServicePage({ params }: Props) {
  const data = await fetchServiceDetails(params.serviceId);

  if (!data || data.error) return notFound();

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{data.service_title}</h1>
      <p className="text-gray-600">
        {data.display_name} — {data.starting_price} LKR
      </p>

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
