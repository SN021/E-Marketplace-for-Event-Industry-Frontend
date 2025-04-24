"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { ratingOptions } from "@/data/ratings";
import { Button } from "@/components/ui/button";

type Review = {
  review: string;
  rating: number;
  created_at: string;
  userId: string;
  user: {
    first_name: string;
    last_name: string;
  };
};

export function Reviews({
  serviceId,
  currentUserId,
  onEdit,
}: {
  serviceId: string;
  currentUserId: string;
  onEdit: (review: { review: string; rating: number }) => void;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    axios
      .post("/api/get-service-reviews", { service_id: serviceId })
      .then((res) => setReviews(res.data.reviews))
      .catch((err) => console.error("Review fetch error:", err));
  }, [serviceId]);

  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500 mt-4">No reviews yet.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Customer Reviews</h3>
      {reviews.map((r, i) => {
        const isMine = r.userId === currentUserId;

        return (
          <div key={i} className="border rounded p-3 shadow-sm">
            <div className="flex justify-between items-center">
              <strong>
                {r.user.first_name} {r.user.last_name}
              </strong>
              <div className="flex items-center gap-1">
                {ratingOptions
                  .sort((a, b) => a.value - b.value)
                  .map((opt) => (
                    <Star
                      key={opt.value}
                      className={`w-5 h-5 ${
                        r.rating >= opt.value
                          ? "fill-yellow-500 stroke-yellow-500"
                          : "stroke-gray-300"
                      }`}
                      aria-label={opt.label}
                    />
                  ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-1">{r.review}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(r.created_at).toLocaleDateString()}
            </p>
            {isMine && (
              <Button
                onClick={() => onEdit({ review: r.review, rating: r.rating })}
                className="mt-2 text-blue-500 text-sm underline"
              >
                Edit my review
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
