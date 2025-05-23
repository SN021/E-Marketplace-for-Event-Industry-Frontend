import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const { data: user, error: userError } = await supabase
      .from("user")
      .select("id")
      .eq("clerk_user_id", payload.userId)
      .single();

    if (userError || !user) {
      console.error("User not found:", userError);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const {
      userName,
      displayName,
      email,
      about,
      businessName,
      brn,
      businessAddress,
      experience,
      website,
      province,
      city,
      paypalEmail,
      businessPhone,
      languages,
      socialLinks,
    } = payload;

    const { error: vendorInsertError } = await supabase.from("vendor").insert([
      {
        id: user.id,
        vendor_username: userName,
        display_name: displayName,
        email: email,
        about,
        business_name: businessName,
        brn,
        business_address: businessAddress,
        experience,
        website,
        province,
        city,
        paypal_email: paypalEmail,
        business_phone: businessPhone,
        languages,
        social_links: socialLinks,
      },
    ]);

    if (vendorInsertError) {
      console.error("Vendor insert error:", vendorInsertError);
      return NextResponse.json(
        { message: "Failed to insert vendor" },
        { status: 500 }
      );
    }

    const { error: flagError } = await supabase
      .from("user")
      .update({ is_vendor: true }) 
      .eq("id", user.id);

    if (flagError) {
      console.error("Failed to flag user as vendor:", flagError);
      return NextResponse.json(
        { message: "Failed to flag vendor request" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Vendor request submitted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in vendor request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
