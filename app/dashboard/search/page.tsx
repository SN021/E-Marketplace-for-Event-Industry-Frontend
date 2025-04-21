import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q;
  if (!query) return notFound();

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(
    `${baseUrl}/api/search?q=${encodeURIComponent(query)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return notFound();
  const services = await res.json();

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>
      {services.length === 0 ? (
        <p className="text-gray-500 text-center text-lg mt-10">
          No results found for "{query}".
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <Link
              href={`/dashboard/services/${service.service_id}`}
              key={service.service_id}
            >
              <div
                key={service.service_id}
                className="bg-white rounded-xl shadow p-4"
              >
                <img
                  src={service.photo_gallery_paths?.[0] || "/placeholder.jpg"}
                  alt={service.service_title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h2 className="font-semibold text-lg">
                  {service.service_title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
