import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getAccessToken() {
  // Comprehensive environment variable validation
  const requiredEnvVars = [
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_API",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`${envVar} is not set`);
      throw new Error(`${envVar} is missing`);
    }
  }

  // Encode credentials
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const res = await fetch(`${process.env.PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: "grant_type=client_credentials",
    });

    // Log full response details
    console.log("PayPal Token Response Status:", res.status);
    const responseText = await res.text();
    console.log("PayPal Token Response Body:", responseText);

    // Check if response is successful
    if (!res.ok) {
      throw new Error(`PayPal API returned ${res.status}: ${responseText}`);
    }

    // Parse the response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse PayPal response:", parseError);
      throw new Error(`Invalid response from PayPal: ${responseText}`);
    }

    // Validate access token
    if (!data.access_token) {
      throw new Error("No access token received from PayPal");
    }

    return data.access_token;
  } catch (error) {
    console.error("Detailed error getting PayPal access token:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Clone the request to allow multiple reads
    const clonedReq = req.clone();

    // Try different methods to parse the request body
    let body;
    try {
      // First, try parsing as JSON
      body = await req.json();
    } catch (jsonError) {
      try {
        // If JSON parsing fails, try text parsing on the cloned request
        const text = await clonedReq.text();
        console.log("Raw request body text:", text);

        // Try parsing the text as JSON
        body = JSON.parse(text);
      } catch (textError) {
        console.error("Failed to parse request body:", textError);
        return NextResponse.json(
          { error: "Invalid request body" },
          { status: 400 }
        );
      }
    }

    console.log("Parsed request body:", body);
    console.log(
      "Using PayPal credentials:",
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );

    // Destructure offerId, with additional logging
    const offerId = body?.offerId;
    console.log("Extracted offerId:", offerId);

    // Validate offerId
    if (!offerId) {
      console.error("No offerId provided");
      return NextResponse.json(
        { error: "offerId is required" },
        { status: 400 }
      );
    }

    // Fetch offer with vendor details
    const { data: offer, error } = await supabase
      .from("offers")
      .select(
        `
        id, 
        price, 
        vendor_id,
        vendor:user (
          id,
          vendor:vendor (
            paypal_email
          )
        )
      `
      )
      .eq("id", offerId)
      .single();

    // Extensive logging
    console.log("Supabase Query Error:", error);
    console.log("Full offer object:", JSON.stringify(offer, null, 2));

    // Extract PayPal email with multiple fallback methods
    let paypalEmail: string | null = null;

    const nestedVendorArray = (offer as any)?.vendor?.vendor;
    if (Array.isArray(nestedVendorArray) && nestedVendorArray.length > 0) {
      paypalEmail = nestedVendorArray[0]?.paypal_email;
    }

    // Method 2: Direct vendor lookup if first method fails
    if (!paypalEmail) {
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendor")
        .select("paypal_email")
        .eq("id", offer?.vendor_id)
        .single();

      console.log("Direct Vendor Lookup Error:", vendorError);
      console.log("Direct Vendor Data:", JSON.stringify(vendorData, null, 2));

      paypalEmail = vendorData?.paypal_email || null;
    }

    // Validate offer and PayPal email
    if (error || !offer) {
      console.error(`Offer not found for ID: ${offerId}`);
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Check PayPal email
    if (!paypalEmail) {
      console.error(`No PayPal email for offer ID: ${offerId}`);
      return NextResponse.json(
        { error: "Vendor PayPal not set" },
        { status: 400 }
      );
    }

    console.log("Final PayPal Email:", paypalEmail);

    // Get PayPal access token
    let accessToken;
    try {
      accessToken = await getAccessToken();
    } catch (tokenError) {
      console.error("Failed to get PayPal access token:", tokenError);
      return NextResponse.json(
        { error: "Failed to authenticate with PayPal" },
        { status: 500 }
      );
    }

    // Prepare PayPal order body
    const orderBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: offer.price.toString(),
          },
          payee: {
            email_address: paypalEmail,
          },
          custom_id: offer.id.toString(),
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

    // Create PayPal order
    const res = await fetch(`${process.env.PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderBody),
    });

    const order = await res.json();

    // Type-safe link finding
    const approvalUrl = order.links?.find(
      (link: { rel: string; href: string }) => link.rel === "approve"
    )?.href;

    if (!approvalUrl) {
      console.error("Failed to create PayPal order");
      console.error("PayPal Order Response:", JSON.stringify(order, null, 2));
      return NextResponse.json(
        { error: "PayPal order creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: approvalUrl });
  } catch (unexpectedError) {
    console.error("Unexpected error in payment creation:", unexpectedError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
