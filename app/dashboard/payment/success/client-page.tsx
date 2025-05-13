"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bounce, toast } from "react-toastify";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import { HashLoader } from "react-spinners";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const offerId = searchParams.get("offerId");
  const orderId =
    searchParams.get("token") ||
    searchParams.get("PayerID") ||
    searchParams.get("payerId") ||
    searchParams.get("offer_id");
  const conversationId = searchParams.get("conversationId");
  const lkrAmount = searchParams.get("lkrAmount");
  const usdAmount = searchParams.get("usdAmount");

  const STATUS = {
    PROCESSING: "processing",
    SUCCESS: "success",
    FAILED: "failed",
    ERROR: "error",
  };

  const [status, setStatus] = useState(STATUS.PROCESSING);
  const [statusMessage, setStatusMessage] = useState("Verifying payment...");

  const paymentSuccessMsg = () => {
    toast.success("Payment processing...", {
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
    paymentSuccessMsg();

    if (!orderId || !offerId) {
      setStatus(STATUS.ERROR);
      setStatusMessage("Missing payment details");
      return;
    }

    const confirmPayment = async () => {
      try {
        const res = await axios.post("/api/payment/capture-order", {
          orderId,
          offerId,
        });

        if (res.data.success) {
          setStatus(STATUS.SUCCESS);
          setStatusMessage("Payment confirmed. Redirecting...");
          setTimeout(() => {
            if (conversationId) {
              router.push(`/dashboard/chat/${conversationId}`);
            } else {
              router.push("/dashboard/chat/conversations");
            }
          }, 3000);
        } else {
          setStatus(STATUS.FAILED);
          setStatusMessage("Payment failed or was incomplete.");
        }
      } catch (err) {
        console.error(err);
        setStatus(STATUS.ERROR);
        setStatusMessage("Error confirming payment.");
      }
    };

    confirmPayment();
  }, [orderId, offerId, conversationId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md w-full">
        {status === STATUS.SUCCESS ? (
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        ) : status === STATUS.FAILED || status === STATUS.ERROR ? (
          <CheckCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        ) : (
          <HashLoader color="#D39D55" className="mx-auto h-16 w-16 mb-4" />
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {status === STATUS.SUCCESS
            ? "Payment Successful"
            : status === STATUS.FAILED || status === STATUS.ERROR
            ? "Payment Failed"
            : "Processing Payment"}
        </h1> 

        <p className="text-gray-600 mb-6">{statusMessage}</p>

        {status === STATUS.SUCCESS && lkrAmount && usdAmount && (
          <div className="text-gray-700 mb-4">
            <p>Amount Paid:</p>
            <p className="font-bold">{lkrAmount} LKR</p>
            <p className="text-sm text-gray-500">({usdAmount} USD)</p>
          </div>
        )}

        {(status === STATUS.FAILED || status === STATUS.ERROR) && (
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => router.push("/dashboard/chat/conversations")}
              variant="default"
            >
              Back to Conversations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
