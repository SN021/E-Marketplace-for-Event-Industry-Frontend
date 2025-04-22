import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("services")
    .select("service_id, service_title, description, search_tags, photo_gallery_paths")
    .or(`service_title.ilike.%${query}%,description.ilike.%${query}%,search_tags.ilike.%${query}%`)
    .limit(20);

  if (error) {
    console.error("Search error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

function safeParse(input: any) {
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const parsedData = await Promise.all(
    data.map(async (item) => {
      const paths = safeParse(item.photo_gallery_paths);


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
        photo_gallery_paths: signedUrls.filter(Boolean), 
      };
    })
  );

  return NextResponse.json(parsedData); 
}
