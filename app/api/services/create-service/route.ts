import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

//setup Supabase server client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

//POST route for Clerk webhooks
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Check if user exists
    const { data, error } = await supabase
      .from("user")
      .select("id, is_vendor")
      .eq("clerk_user_id", payload.userId);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const user = data[0];
    if (!user.is_vendor) {
      return NextResponse.json(
        { message: "Forbidden: Only vendors can create services" },
        { status: 403 }
      );
    }

    const id = data?.[0].id;
    const serviceTitle = payload.s_title;
    const serviceCategory = payload.s_category;
    const serviceSubcategory = payload.s_subcategory;
    const searchTags = payload.s_tags;
    const serviceDescription = payload.fullDescription;
    const startingPrice = payload.basePrice;
    const staringPricefeature = payload.basePriceFeatures;
    const cancellationRefundpolicy = payload.cancellationPolicy;
    const serviceableAreas = payload.serviceableAreas;
    const noticePeriod = payload.noticePeriod;
    const otherDetails = payload.otherDetails;
    const discountsAndOffers = payload.discountsAndOffers;
    const photoGallery = payload.photoGalleryPaths;

    const { error: insertError } = await supabase.from("services").insert([
      {
        user_id: id,
        service_title: serviceTitle,
        category: serviceCategory,
        subcategory: serviceSubcategory,
        search_tags: searchTags,
        description: serviceDescription,
        starting_price: startingPrice,
        price_features: staringPricefeature,
        policies: cancellationRefundpolicy,
        serviceable_areas: serviceableAreas,
        notice_period: noticePeriod,
        other_details: otherDetails,
        discounts_and_offers: discountsAndOffers,
        photo_gallery_paths: photoGallery,
        average_rating: 0,
      },
    ]);

    if (insertError) {
      console.error("Service insert error:", insertError.message);
      return NextResponse.json(
        { message: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Service inserted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
