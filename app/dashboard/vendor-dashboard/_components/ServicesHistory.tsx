"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Service = {
  id: string;
  service_title: string;
  category: string;
  thumbnail_url: string;
};

export default function ServicesHistory() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("/api/services/get-service-by-vendorid");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p>Loading services...</p>;

  if (services.length === 0)
    return (
      <div className="text-gray-500">
        Service listing history will appear here.
      </div>
    );

  return (
    <div>
      <h1 className="text-xl font-semibold mb-8">Vendor Services History</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 mx-auto gap-6">
        {services.map((service, id) => (
          <div
            key={id}
            className="bg-white shadow rounded-lg p-4 flex flex-col w-full max-w-[320px] sm:max-w-full justify-between "
          >
            <div>
              <Image
                src={service.thumbnail_url || "/placeholder.jpg"}
                alt={service.service_title}
                width={400}
                height={300}
                className="rounded-md h-[200px] object-cover"
              />

              <div className="mt-4">
                <h2 className="text-lg font-semibold">
                  {service.service_title}
                </h2>
                <p className="text-gray-500">{service.category}</p>
              </div>
            </div>
            <div className="flex  gap-2 mt-4">
              <Link href={`/dashboard/edit-service/${service.id}`}>
                <Button size="sm">Edit</Button>
              </Link>
              <Button
                size="sm"
                variant="secondary"
                className="bg-red-500 hover:bg-red-400 text-white"
                onClick={async () => {
                  await axios.delete(`/api/vendor/services/${service.id}`);
                  setServices((prev) =>
                    prev.filter((s) => s.id !== service.id)
                  );
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
