"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const PaymentSuccess = dynamic(() => import("./client-page"), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
