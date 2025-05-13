import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const subcategory = req.nextUrl.searchParams.get("subcategory");

  if (!query && !subcategory) {
    return NextResponse.json({ error: "Missing query or subcategory" }, { status: 400 });
  }

  let search = supabase
    .from("services")
    .select("service_id, user_id, service_title, description, starting_price, subcategory, search_tags, photo_gallery_paths, discounts_and_offers, average_rating");

  if (query) {
    search = search.or(
      `service_title.ilike.%${query}%,description.ilike.%${query}%,search_tags.ilike.%${query}%`
    );
  }

  if (subcategory) {
    search = search.ilike("subcategory", `%${subcategory}%`);
  }

  const { data: services, error: serviceError } = await search.limit(20);

  if (serviceError) {
    console.error("Search error:", serviceError.message);
    return NextResponse.json({ error: serviceError.message }, { status: 500 });
  }

  if (!services || services.length === 0) {
    return NextResponse.json([]);
  }

  
  const userIds = services.map((s) => s.user_id);
  const allPaths = services.flatMap((s) => {
    try {
      const parsed = JSON.parse(s.photo_gallery_paths || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });


  const { data: vendors, error: vendorError } = await supabase
    .from("vendor")
    .select("id, display_name")
    .in("id", userIds);

  if (vendorError) {
    console.error("Vendor fetch error:", vendorError.message);
    return NextResponse.json({ error: vendorError.message }, { status: 500 });
  }


  const signedUrlPromises = allPaths.map(async (path: string) => {
    try {
      const filePath = path.replace("vendor-assets/", "");
      const { data: signed, error } = await supabase.storage
        .from("vendor-assets")
        .createSignedUrl(filePath, 60 * 60);

      if (error) {
        console.warn(`Error signing ${filePath}:`, error.message);
        return { path, signedUrl: null };
      }

      return { path, signedUrl: signed?.signedUrl || null };
    } catch (err) {
      console.warn(`Signing exception for ${path}:`, err);
      return { path, signedUrl: null };
    }
  });

  const signedUrlResults = await Promise.all(signedUrlPromises);
  const signedUrlMap = new Map(
    signedUrlResults.filter(res => res.signedUrl).map(res => [res.path, res.signedUrl])
  );


  const enrichedServices = services.map((service) => {
    let paths: string[] = [];
    try {
      const parsed = JSON.parse(service.photo_gallery_paths || "[]");
      paths = Array.isArray(parsed) ? parsed : [];
    } catch {
      paths = [];
    }

    const signedUrls = paths.map((p) => signedUrlMap.get(p)).filter(Boolean);

    const vendorInfo = vendors.find((v) => v.id === service.user_id);
    const display_name = vendorInfo?.display_name || "Unknown Vendor";

    return {
      ...service,
      signed_photo_urls: signedUrls,
      display_name,
    };
  });

  return NextResponse.json(enrichedServices);
}
