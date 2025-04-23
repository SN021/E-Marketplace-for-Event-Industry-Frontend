"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ServiceFilters from "../_components/SidebarFilters";
import { ServiceCard } from "../_components/ServiceCard";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const subcategory = searchParams.get("subcategory");

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setError(true);
      return;
    }

    async function fetchSearchResults() {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query ?? "")}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();
        setServices(data);
        setLoading(false);
      } catch (err) {
        console.error("Search error:", err);
        setError(true);
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  const handleFilterApply = async (filters: any) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/filter-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...filters,
          subcategory,
          q: query,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }
      setServices(data);
    } catch (err) {
      console.error("Filter error:", err);
      setError(true);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  if (!query && !subcategory) {
    return (
      <div className="max-w-screen-xl mx-auto p-6">
        Search query or subcategory is required
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto p-6 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-xl">Loading search results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto p-6">
        Error loading search results
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6 pt-12">
        Search Results for {query ? `"${query}"` : `"${subcategory}"`}
      </h1>

      <div className="grid grid-cols-5 w-full gap-5 max-w-screen-xl mx-auto p-4">
        <div className="sticky">
          <ServiceFilters onApply={handleFilterApply} />
        </div>
        <div className="col-span-4">
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
                  <div className="cursor-pointer">
                    <ServiceCard
                      title={service.service_title}
                      seller={service.display_name}
                      price={service.starting_price}
                      imageUrl={
                        service.signed_photo_urls?.[0] || "/placeholder.jpg"
                      }
                      discount={service.discount}
                    />
                  </div>
                  {/* <div className="bg-white rounded-xl shadow p-4">
                    <img
                      src={
                        service.signed_photo_urls?.[0] || "/placeholder.jpg"
                      }
                      alt={service.service_title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h2 className="font-semibold text-lg">
                      {service.service_title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {service.description}
                    </p>
                  </div> */}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="max-w-screen-xl mx-auto p-6 flex justify-center items-center min-h-[50vh]">
      <div className="animate-pulse text-xl">Loading search results...</div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults />
    </Suspense>
  );
}
