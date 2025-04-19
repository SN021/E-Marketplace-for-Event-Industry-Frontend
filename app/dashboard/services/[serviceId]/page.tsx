import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host");
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/get-service-by-id?id=${serviceId}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();
  const data = await res.json();
  if (!data || data.error) return notFound();

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Title and Vendor Info */}
      <h1 className="text-3xl font-bold mb-1">{data.service_title}</h1>
      <p className="text-gray-600 text-sm mb-4">
        Listed by {data.display_name}
      </p>

      {/* Gallery Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {data.photo_gallery?.slice(0, 4).map((url: string, index: number) => (
          <img
            key={index}
            src={url}
            alt={`Photo ${index + 1}`}
            className="w-200 h-80 aspect-[4/3] rounded-xl object-cover "
          />
        ))}
      </div>
      <div className="mt-20 grid grid-cols-2 gap-15">
        {/* Description Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Service Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {data.service_description}
          </p>
        </section>
        <div>
          {/* Price Features Section */}
          <section className="bg-[#fcf9f1] p-6 rounded-xl shadow-md mx-auto mt-9.5 h-85">
            <h2 className="text-yellow-600 text-m font-semibold mb-1 text-center">
              Base Price
            </h2>
            <p className="text-center text-3xl font-bold text-gray-900 mb-4">
              LKR{" "}
              <span className="text-4xl">
                {data.starting_price?.toLocaleString()}
              </span>
            </p>

            <div className="border-t border-gray-200 my-4" />

            <h3 className="text-lg font-semibold mb-2">Base Price Includes</h3>
            <ul className="list-none space-y-2 text-gray-700">
              {data.price_features
                ?.filter((feature: string) => feature && feature.trim() !== "")
                .map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-[2px] text-yellow-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
            </ul>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-10 mb-8">
            <Button> Request a Quotation</Button>
            <Button>Contact Vendor</Button>
          </div>
        </div>

        {/* Serviceable Areas */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Serviceable Areas</h2>
          <p className="text-gray-700">
            {Array.isArray(data.servicable_areas)
              ? data.servicable_areas.join(", ")
              : JSON.parse(data.servicable_areas || "[]").join(", ")}
          </p>
        </section>

        {/* Notice/Lead Period */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Notice/Lead Period</h2>
          <p className="text-gray-700">{data.notice_period}</p>
        </section>

        {/* Cancellation & Refund Policy */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Cancellation & Refund Policy
          </h2>
          <p className="text-gray-700">{data.cancellation_policy}</p>
        </section>

        {/* Other Details */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Any Other Details</h2>
          <p className="text-gray-700">{data.other_details}</p>
        </section>

        {/* Tags */}
        <div className=" gap-2 mb-6">
          {data.tags?.map((tag: string) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full mr-2 mb-2"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Reviews Placeholder */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Reviews</h2>
          <p className="text-gray-500 italic mb-4">
            Review system coming soon...
          </p>
          <div className="flex gap-4">
            <Button>Write a Review</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
