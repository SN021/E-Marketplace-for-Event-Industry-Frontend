"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ratingOptions } from "@/data/ratings";

export function ReviewForm({
  serviceId,
  userId,
  existingReview,
  onSubmitSuccess,
}: {
  serviceId: string;
  userId: string;
  existingReview?: {
    review: string;
    rating: number;
  };
  onSubmitSuccess?: (review: { review: string; rating: number }) => void;
}) {
  const [review, setReview] = useState(existingReview?.review || "");
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setReview(existingReview?.review || "");
    setRating(existingReview?.rating || 5);
  }, [existingReview]);

  const [finalUserId, setFinalUserId] = useState(userId);
  

  useEffect(() => {
    if (userId) setFinalUserId(userId);
  }, [userId]);

  const handleSubmit = async () => {
    setError(null);

    if (!finalUserId) {
      setError("User ID missing, please wait...");
      return;
    }

    if (review.trim().length === 0) {
      setError("Please enter a review before submitting.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/create-service-review", {
        service_id: serviceId,
        user_id: finalUserId,
        review: review.trim(),
        rating,
      });

      onSubmitSuccess?.({ review, rating });
       window.location.reload();
    } catch (err: any) {
        if (err.response?.status === 409) {
          setError("You have already submitted a review for this service.");
        } else {
          setError("Something went wrong. Please try again.");
        }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="mt-6 border-t pt-4 space-y-2">
      <h3 className=" text-md">
        {existingReview ? "Update Your Review" : "Write a Review"}
      </h3>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <span>Rating:</span>
        {ratingOptions
          .sort((a, b) => a.value - b.value)
          .map((opt) => (
            <Star
              key={opt.value}
              className={`w-6 h-6 cursor-pointer transition ${
                (hoverRating || rating) >= opt.value
                  ? "fill-yellow-500 stroke-yellow-500"
                  : "stroke-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(opt.value)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(opt.value)}
              aria-label={opt.label}
            />
          ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || !userId}
      >
        {loading
          ? "Submitting..."
          : existingReview
          ? "Update Review"
          : "Submit Review"}
      </Button>

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
