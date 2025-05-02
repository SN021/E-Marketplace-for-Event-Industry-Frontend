"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export function OfferBubble({
  offerId,
  isSelf,
}: {
  offerId: string;
  isSelf: boolean;
}) {
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchOffer = async () => {
      console.log(offerId);
      try {
        const res = await axios.get(`/api/offers/${offerId}`);
        setOffer(res.data.offer);
        setStatus(res.data.offer.status);
      } catch (err) {
        console.error("Failed to fetch offer:", err);
        setError("Unable to load offer");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId]);

  const handleAction = async (action: "accept" | "decline") => {
    setActionLoading(true);
    try {
      await axios.post(`/api/offers/${offerId}/respond`, { action });
      setStatus(action === "accept" ? "accepted" : "declined");
    } catch (err) {
      console.error("Offer action failed:", err);
      alert("Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return <div className="text-sm text-gray-400">Loading offer...</div>;
  if (error || !offer)
    return (
      <div className="text-red-600 text-sm">{error || "Offer not found"}</div>
    );

  const isAccepted = status === "accepted";
  const isDeclined = status === "declined";

  return (
    <div
      className={`max-w-[75%] px-4 py-3 rounded-xl shadow-md border text-sm ${
        isSelf ? "bg-blue-50 ml-auto" : "bg-yellow-50 mr-auto"
      }`}
    >
      <h3 className="font-semibold text-base mb-1">{offer.title}</h3>
      <p className="text-gray-700 mb-2 whitespace-pre-wrap">
        {offer.description}
      </p>
      <p className="font-bold text-primary text-lg mb-2">
        LKR {Number(offer.price).toLocaleString()}
      </p>

      {isAccepted && (
        <div className="text-green-600 font-semibold">Offer Accepted</div>
      )}
      {isDeclined && (
        <div className="text-red-600 font-semibold">Offer Declined</div>
      )}

      {!isSelf && !isAccepted && !isDeclined && (
        <div className="flex gap-2 mt-2">
          <Button
            className="bg-green-600 text-white text-xs px-3 py-1"
            disabled={actionLoading}
            onClick={() => handleAction("accept")}
          >
            Accept
          </Button>
          <Button
            className="bg-red-600 text-white text-xs px-3 py-1"
            disabled={actionLoading}
            onClick={() => handleAction("decline")}
          >
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}
