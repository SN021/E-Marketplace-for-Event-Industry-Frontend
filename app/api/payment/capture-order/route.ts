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
    // Defensive checks for data structure
    const purchaseUnit = data.purchase_units?.[0];
    const payments = purchaseUnit?.payments?.captures?.[0];
    const amount = payments?.amount;

    if (!purchaseUnit || !payments || !amount) {
      console.error('Incomplete PayPal response structure', {
        hasPurchaseUnit: !!purchaseUnit,
        hasPayments: !!payments,
        hasAmount: !!amount
      });
      
      return NextResponse.json({ 
        success: false, 
        error: 'Incomplete payment information' 
      }, { status: 400 });
    }

    // Fetch offer details to get vendor_id
    const { data: offerData, error: offerError } = await supabase
      .from('offers')
      .select('vendor_id')
      .eq('id', offerId)
      .single();

    if (offerError || !offerData) {
      console.error('Failed to fetch offer details:', offerError);
      return NextResponse.json({ 
        success: false, 
        error: 'Offer not found' 
      }, { status: 404 });
    }

    // Save payment record
    const paymentInsert = await supabase.from("payments").insert({
      offer_id: offerId,
      vendor_id: offerData.vendor_id, // Use the vendor_id from the offer
      amount: amount.value,
      status: "paid",
      paypal_order_id: data.id,
    });

    // Log any insertion errors
    if (paymentInsert.error) {
      console.error('Payment insertion error:', paymentInsert.error);
      return NextResponse.json(
        { success: false, error: paymentInsert.error },
        { status: 400 }
      );
    }

    // Mark offer as paid
    await supabase.from("offers").update({ status: "paid" }).eq("id", offerId);
  }

  return NextResponse.json({ success: true, details: data });
}
