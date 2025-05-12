"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

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

  const handleDecline = async (action: "decline") => {
    setActionLoading(true);
    try {
      await axios.post(`/api/offers/${offerId}/respond`, { action });
      setStatus("declined");
    } catch (err) {
      console.error("Offer action failed:", err);
      alert("Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptAndPay = async () => {
    setActionLoading(true);
    try {
      // Mark offer as accepted
      await axios.post(`/api/offers/${offerId}/respond`, { action: "accept" });
      setStatus("accepted");

      // Log the offerId before making the request
      console.log("Sending offerId:", offerId);

      // Ensure offerId is a string
      const offerIdString = offerId.toString();

      // Create PayPal order with explicit content type and careful payload construction
      const paymentRes = await axios.post(
        "/api/payment/create",
        JSON.stringify({ offerId: offerIdString }), // Explicitly stringify the payload
        {
          headers: {
            "Content-Type": "application/json",
          },
          // Add config to log request details
          transformRequest: [
            (data, headers) => {
              console.log("Request data:", data);
              console.log("Request headers:", headers);
              return data;
            },
          ],
        }
      );

      console.log("Full payment response:", paymentRes);
      console.log("Payment response data:", paymentRes.data);

      const { url } = paymentRes.data;
      if (url) {
        window.location.href = url;
      } else {
        alert("Failed to create PayPal payment.");
      }
    } catch (err) {
      // Detailed error logging
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;

        console.error("Full Axios error object:", axiosError);
        console.error("Error config:", axiosError.config);

        if (axiosError.response) {
          console.error("Detailed error response:", {
            data: axiosError.response.data,
            status: axiosError.response.status,
            headers: axiosError.response.headers,
          });
        }

        // More specific error handling
        if (axiosError.response?.status === 400) {
          console.error("Bad request details:", axiosError.response?.data);
          alert("Invalid request. Please check the offer details.");
        } else if (axiosError.response?.status === 500) {
          console.error("Server error details:", axiosError.response?.data);
          alert("Server error occurred. Please try again.");
        } else {
          alert(`Payment error: ${axiosError.message}`);
        }
      } else {
        console.error("Unexpected error:", err);
        alert("An unexpected error occurred.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-sm text-gray-400 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading offer...
      </div>
    );

  if (error || !offer)
    return (
      <div className="text-red-600 text-sm font-medium">
        {error || "Offer not found"}
      </div>
    );

  const isAccepted = status === "accepted";
  const isDeclined = status === "declined";

  const statusBadge = isAccepted ? (
    <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs font-semibold">
      <CheckCircle className="w-4 h-4" />
      Accepted
    </span>
  ) : isDeclined ? (
    <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-xs font-semibold">
      <XCircle className="w-4 h-4" />
      Declined
    </span>
  ) : null;

  return (
    <div
      className={`max-w-[75%] px-5 py-4 rounded-3xl shadow-lg border backdrop-blur-sm transition-all duration-200
      ${
        isSelf
          ? "bg-gradient-to-br from-blue-50 to-white ml-auto"
          : "bg-gradient-to-br from-yellow-50 to-white mr-auto"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-base text-gray-900 tracking-tight">
          {offer.title}
        </h3>
        {statusBadge}
      </div>

      <div className="prose prose-sm text-gray-700 mb-3 max-w-none">
        <ReactMarkdown>{offer.description}</ReactMarkdown>
      </div>

      <p className="font-bold text-xl text-primary mb-3 tracking-wide">
        LKR {Number(offer.price).toLocaleString()}
      </p>

      {!isSelf && !isAccepted && !isDeclined && (
        <div className="flex gap-2 mt-1">
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full px-5 py-1.5 transition-all duration-200"
            disabled={actionLoading}
            onClick={handleAcceptAndPay}
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Accept"
            )}
          </Button>
          <Button
            variant="destructive"
            className="text-sm font-medium rounded-full px-5 py-1.5 transition-all duration-200"
            disabled={actionLoading}
            onClick={() => handleDecline("decline")}
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Decline"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
