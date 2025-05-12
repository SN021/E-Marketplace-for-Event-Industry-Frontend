"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const offerId = searchParams.get("offerId");
  const orderId = searchParams.get("token");

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (!orderId || !offerId) return;

    const confirmPayment = async () => {
      try {
        const res = await axios.post("/api/payment/capture-order", {
          orderId,
          offerId,
        });

        if (res.data.success) {
          setStatus("✅ Payment confirmed. Redirecting...");
          setTimeout(() => {
            router.push("/dashboard/view-offers");
          }, 3000);
        } else {
          setStatus("❌ Payment failed or was incomplete.");
        }
      } catch (err) {
        console.error(err);
        setStatus("❌ Error confirming payment.");
      }
    };

    confirmPayment();
  }, [orderId, offerId]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
      <p>{status}</p>
    </div>
  );
}
