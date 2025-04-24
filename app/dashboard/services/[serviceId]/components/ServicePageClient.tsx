"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceReviewsWrapper from "./ServiceReviewsWrapper";

export default function ServicePageClient({ data }: { data: any }) {
  const [userId, setUserId] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
        const response = await axios.get("/api/get-user");
        const userData = response.data;
        const id = userData[0]?.id; 
        setUserId(id);
        } catch (error) {
        console.error("Failed to fetch user data:", error);
        } finally {
        setLoadingUser(false);
        }
    };
    fetchUserData();
    }, []);


  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Title and Vendor Info */}
      <h1 className="text-3xl font-bold mb-1">{data.service_title}</h1>
      <p className="text-gray-600 text-sm mb-4">
        Listed by {data.display_name}
      </p>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {data.photo_gallery?.slice(0, 4).map((url: string, index: number) => (
          <img
            key={index}
            src={url}
            alt={`Photo ${index + 1}`}
            className="w-200 h-80 aspect-[4/3] rounded-xl object-cover"
          />
        ))}
      </div>

      <div className="mt-20 grid grid-cols-2 gap-15">
        {/* Service Description */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Service Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {data.service_description}
          </p>
        </section>

        {/* Price + Features */}
        <div>
          <section className="bg-[#fcf9f1] p-6 rounded-xl shadow-md mx-auto mt-9.5 h-85">
            <h2 className="text-yellow-600 text-m font-semibold mb-1 text-center">
              Base Price
            </h2>
            <p className="text-center text-3xl font-bold text-gray-900 mb-4">
              LKR <span className="text-4xl">{data.starting_price?.toLocaleString()}</span>
            </p>

            <div className="border-t border-gray-200 my-4" />

            <h3 className="text-lg font-semibold mb-2">Base Price Includes</h3>
            <ul className="list-none space-y-2 text-gray-700">
              {data.price_features
                ?.filter((feature: string) => feature?.trim())
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
            <Button>Request a Quotation</Button>
            <Button>Contact Vendor</Button>
          </div>
        </div>

        {/* Discounts */}
        {data.discounts_and_offers && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Discounts & Offers</h2>
            <p className="text-red-600">{data.discounts_and_offers}</p>
          </section>
        )}

        {/* Serviceable Areas */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Serviceable Areas</h2>
          <p className="text-gray-700">
            {Array.isArray(data.servicable_areas)
              ? data.servicable_areas.join(", ")
              : JSON.parse(data.servicable_areas || "[]").join(", ")}
          </p>
        </section>

        {/* Notice Period */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Notice/Lead Period</h2>
          <p className="text-gray-700">{data.notice_period}</p>
        </section>

        {/* Cancellation Policy */}
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
        <div className="gap-2 mb-6">
          {data.tags?.map((tag: string) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full mr-2 mb-2"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Rating & Reviews</h2>
            {!loadingUser && userId && (
                <ServiceReviewsWrapper serviceId={data.service_id} userId={userId} />
            )}

        </div>
      </div>
    </div>
  );
}
