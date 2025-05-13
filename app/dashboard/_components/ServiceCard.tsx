"use client";

import { Star, CheckCircle2, Heart, BadgePercent } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";

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

export function ServiceCard({
  serviceId,
  title,
  seller,
  price,
  imageUrl,
  averageRating = 0,
  verified = true,
  discount,
  href = "#",
}: ServiceCardProps) {
  const [saved, setSaved] = useState(false);

  const errorMsg = () => {
    toast.error("An error has occurred", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };
  const savedMsg = () => {
    toast.success("Service saved successfully", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  async function toggleSave() {
    setSaved((s) => !s);
    try {
      await axios.post("/api/save/service-save", { service_id: serviceId });
      savedMsg();
    } catch (err) {
      errorMsg();
      console.error(err);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
      className="group relative isolate"
    >
      <Link
        href={href}
        aria-label={`View ${title}`}
        className="flex h-80 w-full max-w-[320px] flex-col overflow-hidden rounded-xl border border-transparent bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-neutral-900/70"
      >
        <span className="pointer-events-none absolute inset-0 -z-[1] rounded-[inherit] bg-gradient-to-br from-primary/0 via-primary/30 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>

        <figure className="relative h-40 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width:768px) 100vw, 320px"
            priority
            placeholder="blur"
            blurDataURL="https://imgenerate.com/generate?width=400&height=400&bg=d39d55&text_color=ffffff&font_size=24&angle=0&text=Loading"
            className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
          />

          {discount && (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <figcaption
                    aria-label="View discount details"
                    className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full
                       bg-yellow-500/90 text-white shadow cursor-default"
                  >
                    <BadgePercent className="h-4 w-4" />
                    <span className="sr-only">{discount}</span>
                  </figcaption>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {discount}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </figure>

        <div className="flex flex-1 flex-col gap-1 px-4 py-3">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="line-clamp-2 cursor-default text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                {title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            by&nbsp;{seller}
            {verified && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            )}
          </p>

          <span className="mt-1 flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {averageRating.toFixed(1)}
            </span>
          </span>

          <p className="mt-auto text-sm font-semibold">
            Starts at&nbsp;Rs.&nbsp;{price}.00
          </p>
        </div>

        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save service"}
          onClick={(e) => {
            e.preventDefault();
            toggleSave();
          }}
          className={clsx(
            "absolute bottom-4 right-4 grid h-8 w-8 place-items-center rounded-full backdrop-blur-lg transition",
            saved
              ? "text-yellow-500"
              : "text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
          )}
        >
          <Heart className="h-5 w-5" />
        </button>
      </Link>
    </motion.article>
  );
}
