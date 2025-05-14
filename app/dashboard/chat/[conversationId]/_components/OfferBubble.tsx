"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Bounce, toast } from "react-toastify";
import { convertLKRtoUSD } from "@/lib/utils/currency-converter";

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
  const [usdPrice, setUsdPrice] = useState<string | null>(null);

  const errorMsg = () => {
    toast.error("Something went wrong. Please try again.", {
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

  const paymentErrorMsg = () => {
    toast.error("Payment failed. Please try again.", {
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

  useEffect(() => {
    const fetchUsdPrice = async () => {
      try {
        const conversion = await convertLKRtoUSD();
        const usdAmount = (offer?.price * conversion).toFixed(2);
        setUsdPrice(usdAmount);
      } catch (error) {
        console.error('Failed to convert price', error);
      }
    };

    if (offer) {
      fetchUsdPrice();
    }
  }, [offer]);

  const handleDecline = async (action: "decline") => {
    setActionLoading(true);
    try {
      await axios.post(`/api/offers/${offerId}/respond`, { action });
      setStatus("declined");
    } catch (err) {
      console.error("Offer action failed:", err);
      errorMsg();
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptAndPay = async () => {
    // Disable further interactions
    setActionLoading(true);
    
    // Show a loading toast with a spinner
    const loadingToastId = toast.info(
      <div className="flex items-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Please wait while we process your payment. Do not close this window.
      </div>, 
      {
        position: "top-center",
        autoClose: false,  // Prevent auto-closing
        hideProgressBar: true,
        closeOnClick: false,  // Prevent user from closing
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        toastId: "payment-loading",  // Unique ID for easy dismissal
      }
    );
  
    try {
      // Mark offer as accepted
      await axios.post(`/api/offers/${offerId}/respond`, { action: "accept" });
      setStatus("accepted");
  
      // Prepare offer ID for payment
      const offerIdString = offerId.toString();
  
      // Create PayPal order
      const paymentRes = await axios.post(
        "/api/payment/create",
        JSON.stringify({ offerId: offerIdString }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Handle payment response
      const url = paymentRes.data.url;
      if (url) {
        // Dismiss loading toast before redirecting
        toast.dismiss(loadingToastId);
        window.location.href = url;
      } else {
        // Dismiss loading toast and show error
        toast.dismiss(loadingToastId);
        paymentErrorMsg();
      }
    } catch (err) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
  
      // Detailed error handling
      if (axios.isAxiosError(err)) {
        const axiosError = err;
        
        // Log specific error details
        if (axiosError.response?.status === 400) {
          console.error("Bad request details:", axiosError.response?.data);
          paymentErrorMsg();
        } else if (axiosError.response?.status === 500) {
          console.error("Server error details:", axiosError.response?.data);
          paymentErrorMsg();
        } else {
          paymentErrorMsg();
        }
      } else {
        console.error("Unexpected error:", err);
        paymentErrorMsg();
      }
    } finally {
      // Re-enable interactions
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
        {usdPrice && <span className="text-sm text-gray-500 ml-2">({usdPrice} USD)</span>}
      </p>

      {!isSelf && !isAccepted && !isDeclined && (
        <>
          <p className="text-sm text-gray-600 mb-3 italic">
            By accepting this offer, you'll be securely redirected to our payment gateway to complete your transaction.
          </p>
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
                "Accept & Proceed to Payment"
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
                "Decline Offer"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
