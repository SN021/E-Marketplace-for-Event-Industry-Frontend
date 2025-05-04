"use client";

import { Star, CheckCircle, Heart } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Bounce, ToastContainer, toast } from "react-toastify";


type ServiceCardProps = {
  serviceId: string;
  title: string;
  seller: string;
  price: string;
  imageUrl: string;
  averageRating?: number;
  verified?: boolean;
  discount?: string;
  href?: string;
};

export const ServiceCard = ({
  serviceId,
  title,
  seller,
  price,
  imageUrl,
  verified = true,
  discount,
  averageRating,
  href = "#",
}: ServiceCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const notifySave = () => toast("Saved");

  const toggleSave = async () => {
    try {
      setIsSaved((prev) => {
        const next = !prev;
        return next;
      });

      await axios.post("/api/service-save", {
        service_id: serviceId,
      });
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  return (
    <Link
      href={href}
      className="block w-full max-w-[320px] sm:max-w-full h-[360px] bg-white rounded-lg shadow-sm p-4 relative flex flex-col justify-between hover:shadow-md transition"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-[150px] object-cover rounded"
      />

      <div>
        <Heart
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleSave();
            notifySave();
          }}
          className={`absolute bottom-3 right-3 w-5 h-5 cursor-pointer transition ${
            isSaved ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
          }`}
        />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>

      <h3 className="text-sm font-semibold mt-3 break-words line-clamp-2">
        {title}
      </h3>

      <p className="text-xs text-gray-500 flex items-center gap-1">
        by {seller}
        {verified && <CheckCircle className="w-4 h-4 text-green-600" />}
      </p>

      <div className="flex items-center gap-1 mt-1">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="text-xs font-medium text-gray-700">
          {averageRating?.toFixed(1)}
        </span>
      </div>

      <p className="mt-2 font-semibold text-sm">Starts at Rs. {price}.00</p>

      {discount && (
        <p className="mt-1 text-sm text-yellow-500 font-medium">{discount}</p>
      )}
    </Link>
  );
};
