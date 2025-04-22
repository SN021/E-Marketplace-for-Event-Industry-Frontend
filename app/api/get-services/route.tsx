import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select(
        "service_id, service_title, starting_price, photo_gallery_paths, user_id, discounts_and_offers"
      )
      .order("created_at", { ascending: false })
      .limit(12);

    if (serviceError || !serviceData) {
      console.error("Service fetch error:", serviceError?.message);
      return NextResponse.json({ error: "Error fetching services" }, { status: 500 });
    }

    // signed URL for first image of each service
    const signedServices = await Promise.all(
      serviceData.map(async (service) => {
        let firstImage: string | null = null;

        try {
          const parsedGallery: string[] = JSON.parse(service.photo_gallery_paths || "[]");
          firstImage = parsedGallery[0];
        } catch {
          console.warn("Failed to parse photo_gallery_paths for service:", service.service_id);
        }

        let signedUrl = null;
        if (firstImage) {
          const { data, error } = await supabase.storage
            .from("vendor-assets")
            .createSignedUrl(firstImage, 60 * 60);
          if (!error && data?.signedUrl) signedUrl = data.signedUrl;
        }

        const { data: vendorData, error: vendorError } = await supabase
          .from("vendor")
          .select("display_name")
          .eq("id", service.user_id)
          .maybeSingle();

        const display_name = vendorData?.display_name || "Unknown Vendor";

        return {
          ...service,
          signedUrl,
          display_name,
        };
      })
    );


    // Format response
    const formatted = signedServices.map((service) => ({
      id: service.service_id,
      title: service.service_title,
      price: service.starting_price,
      seller: service.display_name,
      imageUrl: service.signedUrl || "/default-thumbnail.jpg",
      discount: service.discounts_and_offers || null,
    }));


    return NextResponse.json({ services: formatted });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
