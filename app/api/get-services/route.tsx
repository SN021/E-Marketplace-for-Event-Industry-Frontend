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
    const { data: userData, error: userError } = await supabase
      .from("user")
      .select()
      .eq("clerk_user_id", userId);

    if (userError || !userData) {
      console.error("User fetch error:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const id = userData?.[0].id;

    const { data: vendorData, error: vendorError } = await supabase
      .from("vendor")
      .select("display_name")
      .eq("id", id)
      .maybeSingle();
    if (vendorError || !vendorData) {
      console.error("Vendor fetch error:", vendorError);
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select(
        "service_id, service_title, starting_price, photo_gallery_paths,user_id"
      )
      .order("created_at", { ascending: false })
      .limit(12);

    if (serviceError || !serviceData) {
      console.error("Error fetching services:", serviceError?.message);
      return NextResponse.json(
        { error: "Error fetching services" },
        { status: 500 }
      );
    }

    const signedServices = await Promise.all(
      serviceData.map(async (service) => {
        const firstImage = service.photo_gallery_paths?.[0];

        let signedUrl = null;
        if (firstImage) {
          const { data, error } = await supabase.storage
            .from("vendor-assets")
            .createSignedUrl(`photo-gallery/${firstImage}`, 60 * 60);

          if (!error && data?.signedUrl) {
            signedUrl = data.signedUrl;
          }
        }

        return {
          ...service,
          signedUrl,
        };
      })
    );

    const formatted = signedServices.map((service) => ({
      id: service.service_id,
      title: service.service_title,
      price: service.starting_price,
      seller: vendorData.display_name,
      imageUrl: service.signedUrl || "/default-thumbnail.jpg",
    }));
    return NextResponse.json({ services: formatted });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
