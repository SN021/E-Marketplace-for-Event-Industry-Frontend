import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: NextRequest) {
  try {
    const payload = await req.json();

 if (!payload?.userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

 // get user details using Clerk user ID
    const { data: userData, error: userError } = await supabase
    .from('user')
    .select()
    .eq('clerk_user_id', payload.userId);


 if (userError || !userData) {
      console.error("User fetch error:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

  const id = userData?.[0].id;

  const { data: vendorData, error: vendorError } = await supabase
    .from("vendor")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (vendorError) {
    console.error("Vendor fetch error:", vendorError);
    return NextResponse.json({ error: vendorError.message }, { status: 500 });
  }

  if (!vendorData) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }


  const { error:updateError } = await supabase
    .from("vendor")
    .update({
      business_name: payload.business_name,
      paypal_email: payload.paypal_email,
      business_phone: payload.business_phone,
      business_address: payload.business_address,
      experience: payload.experience,
      website: payload.website,
      about: payload.about,
      social_links: payload.social_links,
    })
    .eq("id",id);

    if (updateError) {
      console.error('Vendor update error:', updateError);
      return NextResponse.json({ message: 'Failed to update vendor' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Vendor updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}