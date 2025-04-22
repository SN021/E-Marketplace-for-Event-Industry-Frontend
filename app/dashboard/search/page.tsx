'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// This will be our main search results component
function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setError(true);
      return;
    }

    async function fetchSearchResults() {
      try {
        if (query) {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
            cache: "no-store",
          });

          if (!res.ok) {
            throw new Error('Failed to fetch search results');
          }
          
          const data = await res.json();
          setServices(data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Search error:', err);
        setError(true);
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  if (!query) {
    return <div className="max-w-screen-xl mx-auto p-6">Search query is required</div>;
  }

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto p-6 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-xl">Loading search results...</div>
      </div>
    );
  }

  if (error) {
    return <div className="max-w-screen-xl mx-auto p-6">Error loading search results</div>;
  }

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
              <div className="bg-white rounded-xl shadow p-4">
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

// Loading fallback component
function SearchLoading() {
  return (
    <div className="max-w-screen-xl mx-auto p-6 flex justify-center items-center min-h-[50vh]">
      <div className="animate-pulse text-xl">Loading search results...</div>
    </div>
  );
}

// This is the main page component that wraps everything in Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults />
    </Suspense>
  );
}