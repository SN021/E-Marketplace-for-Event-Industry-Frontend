"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ServiceCard } from "../_components/ServiceCard";

type SavedService = {
  service_id: string;
  service_title: string;
  starting_price: number | string;
  display_name: string;
  signed_photo_urls: string[];
  discount?: string;
  averageRating: number;
};

export default function SavedServicesPage() {
  const [services, setServices] = useState<SavedService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await axios.get("/api/get-saved");
        setServices(res.data || []);
      } catch (err) {
        console.error("Failed to fetch saved services", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSaved();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-6 pt-12">
      <h1 className="text-2xl font-bold mb-4">Saved Services</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : services.length === 0 ? (
        <p className="text-gray-500">No saved services yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.service_id}
              serviceId={service.service_id}
              title={service.service_title}
              seller={service.display_name}
              price={service.starting_price.toString()}
              imageUrl={service.signed_photo_urls?.[0] || "/placeholder.jpg"}
              discount={service.discount}
              averageRating={service.averageRating}
            />
          ))}
        </div>
      )}
    </div>
  );
}