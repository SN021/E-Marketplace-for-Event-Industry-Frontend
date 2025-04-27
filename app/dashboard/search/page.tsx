"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ServiceFilters from "../_components/SidebarFilters";
import { ServiceCard } from "../_components/ServiceCard";
import { HashLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

type FiltersType = {
  rating?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  experience?: string[];
  location?: string[];
  sortOrder?: string | null;
};


function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const subcategory = searchParams.get("subcategory");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FiltersType>({});



  useEffect(() => {
    if (!query && !subcategory) {
      setLoading(false);
      setError(true);
      return;
    }

    async function fetchSearchResults() {
      try {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (subcategory) params.append("subcategory", subcategory);

        const res = await fetch(`/api/search?${params.toString()}`, {
          cache: "no-store",
        });

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

    
    setServices([]);
    setCurrentPage(1); 
    setFilters({});
    fetchSearchResults();
  }, [query, subcategory]);

  function formatSubcategoryLabel(slug: string): string {
    return slug
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }


const handleFilterApply = async (newFilters?: any, page = 1) => {
  const effectiveFilters = newFilters ?? filters;
  setLoading(true);
  setError(false);

  try {

    const isReset =
      !effectiveFilters || Object.keys(effectiveFilters).length === 0;

    if (isReset) {
 
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (subcategory) params.append("subcategory", subcategory);

      const res = await fetch(`/api/search?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }
      setServices(data);
    } else {
    
      const payload = {
        ...effectiveFilters,
        query: query || null,
        subcategory: subcategory || null,
        sortOrder: effectiveFilters.sortOrder || null,
        page,
        limit: 12,
      };

      const res = await fetch("/api/filter-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }
      if (page === 1) {
        setServices(data);
      } else {
        setServices((prev) => [...prev, ...data]);
      }
    }

    if (newFilters) {
      setFilters(newFilters);
    }
    setCurrentPage(page);
  } catch (err) {
    console.error("Filter error:", err);
    setError(true);
    if (page === 1) setServices([]);
  } finally {
    setLoading(false);
  }
};


  const handleLoadMore = () => {
    handleFilterApply(undefined, currentPage + 1); 
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
        <HashLoader color="#D39D55" />
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
        Search Results for{" "}
        {query
          ? `"${query}"`
          : subcategory
          ? `"${formatSubcategoryLabel(subcategory)}"`
          : ""}
      </h1>

      {(filters.rating ||
        filters.minPrice ||
        filters.maxPrice ||
        (filters.experience && filters.experience.length > 0) ||
        (filters.location && filters.location.length > 0)) && (
        <div className="text-sm text-gray-600 mb-6 space-x-2">
          {filters.rating && (
            <span className="inline-block bg-gray-200 px-2 py-1 rounded">
              ⭐ {filters.rating}+
            </span>
          )}
          {(filters.minPrice != null || filters.maxPrice != null) && (
            <span className="inline-block bg-gray-200 px-2 py-1 rounded">
              Price:{" "}
              {filters.minPrice != null ? `LKR ${filters.minPrice}` : "Any"} -{" "}
              {filters.maxPrice != null ? `LKR ${filters.maxPrice}` : "Any"}
            </span>
          )}
          {filters.experience && filters.experience.length > 0 && (
            <span className="inline-block bg-gray-200 px-2 py-1 rounded">
              Experience: {filters.experience.join(", ")}
            </span>
          )}
          {filters.location && filters.location.length > 0 && (
            <span className="inline-block bg-gray-200 px-2 py-1 rounded">
              Location: {filters.location.join(", ")}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-5 w-full gap-5 max-w-screen-xl mx-auto p-4">
        <div className="sticky">
          <ServiceFilters onApply={handleFilterApply} />
        </div>
        <div className="col-span-4">
          {services.length === 0 ? (
            <p className="text-gray-500 text-center text-lg mt-10">
              No results found for{" "}
              {query
                ? `"${query}"`
                : subcategory
                ? `"${formatSubcategoryLabel(subcategory)}"`
                : ""}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-30 gap-y-10">
                {services.map((service: any) => (
                  <Link
                    href={`/dashboard/services/${service.service_id}`}
                    key={service.service_id}
                  >
                    <div className="cursor-pointer ">
                      <ServiceCard
                        title={service.service_title}
                        serviceId={service.service_id}
                        seller={service.display_name}
                        price={service.starting_price}
                        imageUrl={
                          service.signed_photo_urls?.[0] || "/placeholder.jpg"
                        }
                        discount={service.discounts_and_offers}
                        averageRating={service.average_rating}
                      />
                    </div>
                  </Link>
                ))}
              </div>
              {services.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark transition"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
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
