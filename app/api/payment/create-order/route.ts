
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get PayPal access token
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

// Create Order API
export async function POST(req: NextRequest) {
  const { offerId } = await req.json();

  // Load the offer + vendor's paypal_id
  const { data: offer, error } = await supabase
    .from("offers")
    .select("id, price, vendor_id, vendor:paypal_email")
    .eq("id", offerId)
    .single();

  if (error || !offer) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  if (!offer.vendor?.paypal_email) {
    return NextResponse.json({ error: "Vendor has not set up PayPal" }, { status: 400 });
  }

  const accessToken = await getAccessToken();

  const orderBody = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "LKR",
          value: offer.price.toString(),
        },
        payee: {
          email_address: offer.vendor.paypal_email,
        },
        custom_id: offer.id,
      },
    ],
    application_context: {
      brand_name: "Venzor",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?offerId=${offer.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    },
  };

  const res = await fetch(`${process.env.PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderBody),
  });

  const order = await res.json();

  const approvalUrl = order.links?.find((link: any) => link.rel === "approve")?.href;

  if (!approvalUrl) {
    return NextResponse.json({ error: "PayPal order creation failed" }, { status: 500 });
  }

  return NextResponse.json({ url: approvalUrl });
}
