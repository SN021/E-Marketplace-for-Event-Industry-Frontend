import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${process.env.PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  const { orderId, offerId } = await req.json();
  const accessToken = await getAccessToken();

  const res = await fetch(`${process.env.PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (data.status === "COMPLETED") {
    // Save payment record
    await supabase.from("payments").insert({
      offer_id: offerId,
      vendor_id: data.purchase_units[0].payee.merchant_id,
      client_id: null, // You can fetch this from offer
      amount: data.purchase_units[0].amount.value,
      status: "paid",
      paypal_order_id: data.id,
    });

    // Mark offer as paid
    await supabase.from("offers").update({ status: "paid" }).eq("id", offerId);
  }

  return NextResponse.json({ success: true, details: data });
}
