"use client";

import { useEffect, useState } from "react";
import { ServiceCard } from "./ServiceCard";
import { HashLoader } from "react-spinners";
import Link from "next/link";
import axios from "axios";
import { logServiceView } from '@/lib/utils/analytics';

type Service = {
  serviceId: string;
  id: string;
  title: string;
  price: number;
  seller: string;
  imageUrl: string;
  discount?: string;
  averageRating: number;
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
        const res = await fetch("/api/services/get-services");
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
        <div className="flex items-center justify-center">
          <HashLoader color="#D39D55" />
        </div>
      ) : services.length === 0 ? (
        <p className="text-gray-500 text-sm">No services found.</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 pb-2 container mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex-shrink-0 min-w-[280px] max-w-[320px] md:min-w-0"
            >
              <div onClick={() => logServiceView(service.id)}>
                <ServiceCard
                  serviceId={service.id}
                  title={service.title}
                  seller={service.seller}
                  price={service.price.toString()}
                  imageUrl={service.imageUrl}
                  discount={service.discount}
                  averageRating={service.averageRating}
                  href={`/dashboard/services/${service.id}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
