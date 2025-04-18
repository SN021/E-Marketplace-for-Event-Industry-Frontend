"use client";

import { useEffect, useState } from "react";
import { ServiceCard } from "./ServiceCard";
import Link from "next/link";

type Service = {
  id: string;
  title: string;
  price: number;
  seller: string;
  imageUrl: string;
};

type ServiceCarouselProps = {
  title: string;
};

export const ServiceCarousel = ({ title }: ServiceCarouselProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/get-services");
        const json = await res.json();
        setServices(json.services || []);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="my-10">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-gray-500 text-sm">No services found.</p>
      ) : (
        <div className="grid grid-cols-4 gap-10 overflow-x-auto pb-2 justify-center container mx-auto">
          {services.map((service) => (
            <Link key={service.id} href={`/dashboard/services/${service.id}`}>
              <div className="cursor-pointer">
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  seller={service.seller}
                  price={service.price.toString()}
                  imageUrl={service.imageUrl}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
