"use client";

import { useState, useEffect } from "react";
import { ReviewForm } from "./ReviewForm";
import { Reviews } from "./Reviews";

export default function ServiceReviewsWrapper({
  serviceId,
  userId,
}: {
  serviceId: string;
  userId: string;
}) {
  const [editingReview, setEditingReview] = useState<{
    review: string;
    rating: number;
  }>();

  // Prevent premature render if userId is not ready
  if (!userId) {
    return (
      <div className="text-sm text-gray-500 italic">Loading user reviews...</div>
    );
  }

  return (
    <div>
      <Reviews
        serviceId={serviceId}
        currentUserId={userId}
        onEdit={(review) => setEditingReview(review)}
      />
      <ReviewForm
        serviceId={serviceId}
        userId={userId}
        existingReview={editingReview}
        onSubmitSuccess={(review) => setEditingReview(review)}
      />
    </div>
  );
}
