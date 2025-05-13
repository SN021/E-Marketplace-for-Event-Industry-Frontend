import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("id");

  if (!serviceId) {
    return NextResponse.json({ error: "Missing serviceId" }, { status: 400 });
  }

  try {
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select(`*`)
      .eq("service_id", serviceId)
      .maybeSingle();

    if (serviceError || !service) {
      console.error("Service fetch error:", serviceError?.message);
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Parse gallery and get signed URL for each image (or just first one if you prefer)
    let signedUrls: string[] = [];

    try {
      const gallery: string[] = JSON.parse(service.photo_gallery_paths || "[]");

      const signed = await Promise.all(
        gallery.map(async (imgPath) => {
          const { data, error } = await supabase.storage
            .from("vendor-assets")
            .createSignedUrl(imgPath, 60 * 60);
          return !error && data?.signedUrl ? data.signedUrl : null;
        })
      );

      signedUrls = signed.filter(Boolean) as string[];
    } catch {
      console.warn("Failed to parse or sign images for service:", serviceId);
    }


    const { data: vendorData } = await supabase
      .from("vendor")
      .select("display_name")
      .eq("id", service.user_id)
      .maybeSingle();

    const display_name = vendorData?.display_name || "Unknown Vendor";
    let parsedTags: string[] = [];
     try {
       parsedTags = JSON.parse(service.search_tags || "[]");
     } catch {
       console.warn("Failed to parse tags for service:", serviceId);
     }

     let parsedPriceFeatures: string[] = [];
try {
  parsedPriceFeatures = JSON.parse(service.price_features || "[]");
} catch {
  console.warn("Failed to parse price_features for service:", serviceId);
}


  return NextResponse.json({
  service_id: service.service_id,
  service_title: service.service_title,
  starting_price: service.starting_price,
  display_name,
  photo_gallery: signedUrls,
  user_id: service.user_id,
  service_description: service.description,
  servicable_areas: service.serviceable_areas,
  notice_period: service.notice_period,
  other_details: service.other_details,
  cancellation_policy: service.policies,
  tags: parsedTags,
  price_features: parsedPriceFeatures,
  discounts_and_offers: service.discounts_and_offers || "",
  averageRating: service.average_rating || 0,
});
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
