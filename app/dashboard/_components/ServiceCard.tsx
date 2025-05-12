"use client";

import { Star, CheckCircle, Heart, BadgePercent } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

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
      setIsSaved((prev) => !prev);

      await axios.post("/api/save/service-save", {
        service_id: serviceId,
      });
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href={href}
          className="w-full max-w-[320px] sm:max-w-full h-[350px] bg-white rounded-lg shadow-sm p-4 relative flex flex-col group hover:shadow-lg transition-all duration-300"
        >
          {/* Image */}
          <div className="overflow-hidden rounded w-full h-[150px] relative">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded transform transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL="/blur-placeholder.png" // you can replace this with a base64 or actual tiny placeholder
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between grow mt-3 overflow-hidden">
            <TooltipProvider>
              {/* Title with tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="truncate cursor-default">
                    <h3 className="text-sm font-semibold">{title}</h3>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs max-w-xs">
                  {title}
                </TooltipContent>
              </Tooltip>

              {/* Seller info */}
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                by {seller}
                {verified && <CheckCircle className="w-4 h-4 text-green-600" />}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium text-gray-700">
                  {averageRating?.toFixed(1)}
                </span>
              </div>

              {/* Price */}
              <p className="mt-2 font-semibold text-sm">
                Starts at Rs. {price}.00
              </p>

              {/* Discount with tooltip */}
              {discount && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate flex items-center gap-1 cursor-default mt-1">
                      <BadgePercent className="w-4 h-4 text-yellow-500" />
                      <p className="text-sm text-yellow-600 font-semibold">
                        {discount}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs max-w-xs">
                    {discount}
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>

          {/* Heart Icon */}
          <motion.div
            whileTap={{ scale: 1.3 }}
            className="absolute bottom-4 right-4"
          >
            <Heart
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleSave();
                notifySave();
              }}
              className={`w-5 h-5 cursor-pointer transition ${
                isSaved
                  ? "text-yellow-500"
                  : "text-gray-400 hover:text-yellow-500"
              }`}
            />
          </motion.div>

          {/* Toast */}
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            closeOnClick={false}
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};
