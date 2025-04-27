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

    const { data: currentUser, error: userError } = await supabase
    .from("user")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (userError || !currentUser) {
    console.error("User lookup error:", userError?.message);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const internalUserId = currentUser.id;
  const { data: saved, error: savedError } = await supabase
    .from("saved_services")
    .select("service_id")
    .eq("user_id",internalUserId);

  if (savedError) {
    console.error("Fetch saved_services error:", savedError.message);
    return NextResponse.json({ error: "Failed to fetch saved services" }, { status: 500 });
  }

  const serviceIds = saved.map((s) => s.service_id);

  if (serviceIds.length === 0) {
    return NextResponse.json([]);
  }

 
  const { data: services, error: serviceError } = await supabase
    .from("services")
    .select("service_id, user_id, service_title, starting_price, photo_gallery_paths, discounts_and_offers, average_rating")
    .in("service_id", serviceIds);

  if (serviceError) {
    console.error("Fetch services error:", serviceError.message);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }


  const fullData = await Promise.all(
    services.map(async (item) => {
      const { data: vendor } = await supabase
        .from("vendor")
        .select("display_name")
        .eq("id", item.user_id)
        .maybeSingle();

      const paths = (() => {
        try {
          const parsed = JSON.parse(item.photo_gallery_paths);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })();

      const signed_photo_urls = await Promise.all(
        paths.map(async (path: string) => {
          const { data: signed, error } = await supabase.storage
            .from("vendor-assets")
            .createSignedUrl(path.replace("vendor-assets/", ""), 60 * 60);
          return signed?.signedUrl || null;
        })
      );

      return {
        ...item,
        display_name: vendor?.display_name || "Unknown Vendor",
        discount: item.discounts_and_offers,
        signed_photo_urls: signed_photo_urls.filter(Boolean),
      };
    })
  );

  return NextResponse.json(fullData);
}
