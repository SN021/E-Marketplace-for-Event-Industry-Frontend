"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bounce, toast } from "react-toastify";

export default function PaymentCancelled() {
  const router = useRouter();
  const paymentCancelMsg = () => {
    toast.error("Payment cancelled.", {
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
    paymentCancelMsg();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Payment Cancelled
      </h1>
      <p className="text-gray-600 mb-6">
        You cancelled the payment. No charges were made. You can return to your
        dashboard to continue.
      </p>

      <Button onClick={() => router.push("/dashboard/view-offers")}>
        Go Back to Dashboard
      </Button>
    </div>
  );
}
