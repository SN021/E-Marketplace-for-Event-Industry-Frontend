import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const subcategory = req.nextUrl.searchParams.get("subcategory"); // ✅ new

  // ✅ Now both q or subcategory are allowed
  if (!query && !subcategory) {
    return NextResponse.json({ error: "Missing query or subcategory" }, { status: 400 });
  }

  let search = supabase
    .from("services")
    .select("service_id, user_id, service_title, description, starting_price, subcategory, search_tags, photo_gallery_paths");

  // ✅ Search by keyword if present
  if (query) {
    search = search.or(
      `service_title.ilike.%${query}%,description.ilike.%${query}%,search_tags.ilike.%${query}%`
    );
  }

  // ✅ Add subcategory filtering if present
  if (subcategory) {
    search = search.ilike("subcategory", `%${subcategory}%`);
  }

  const { data, error } = await search.limit(20);

  if (error) {
    console.error("Search error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ✅ Safely parse photo_gallery_paths
  function safeParse(input: any) {
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  // ✅ Enrich each service with vendor name and signed URLs
  const parsedData = await Promise.all(
    data.map(async (item) => {
      const paths = safeParse(item.photo_gallery_paths);

      const { data: vendorData } = await supabase
        .from("vendor")
        .select("display_name")
        .eq("id", item.user_id)
        .maybeSingle();

      const display_name = vendorData?.display_name || "Unknown Vendor";

      const signedUrls = await Promise.all(
        paths.map(async (path: string) => {
          const filePath = path.replace("vendor-assets/", "");
          const { data: signed, error } = await supabase.storage
            .from("vendor-assets")
            .createSignedUrl(filePath, 60 * 60);

          if (error) {
            console.warn(`Error signing ${filePath}:`, error.message);
            return null;
          }

          return signed?.signedUrl || null;
        })
      );

      return {
        ...item,
        signed_photo_urls: signedUrls.filter(Boolean),
        display_name,
      };
    })
  );

  return NextResponse.json(parsedData);
}
