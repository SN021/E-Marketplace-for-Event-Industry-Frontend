import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { rating, minPrice, maxPrice, experience, location } = await req.json();


  let query = supabase
    .from("services")
    .select("*");

  if (minPrice != null) query = query.gte("starting_price", minPrice);
  if (maxPrice != null) query = query.lte("starting_price", maxPrice);
  if (location) query = query.ilike("serviceable_area", `%${location}%`);

  const { data: services, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const serviceIds = services.map(s => s.service_id);
  const userIds = services.map(s => s.user_id);


  const { data: vendors, error: vendorError } = await supabase
    .from("vendor")
    .select("id, experience")
    .in("id", userIds);

  if (vendorError) return NextResponse.json({ error: vendorError.message }, { status: 500 });


  const { data: ratings, error: ratingError } = await supabase
    .from("service_rating")
    .select("service_id, rating")
    .in("service_id", serviceIds);

  if (ratingError) return NextResponse.json({ error: ratingError.message }, { status: 500 });

const enriched = await Promise.all(
    services.map(async service => {
      const vendorInfo = vendors.find(v => v.id === service.user_id);
      const ratingInfo = ratings.find(r => r.service_id === service.service_id);

let paths: string[] = [];

try {

  if (Array.isArray(service.photo_gallery_paths)) {
    paths = service.photo_gallery_paths;
  } else if (typeof service.photo_gallery_paths === "string") {
    paths = JSON.parse(service.photo_gallery_paths);
  }
} catch (err) {
  console.error("Error parsing photo_gallery_paths:", err);
};

      const signedPhotos = await Promise.all(
  paths.map(async (path: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from("vendor-assets")
        .createSignedUrl(path, 60 * 60);
      if (error) {
        console.error("Signed URL error for path:", path, error.message);
        return null;
      }
      return data?.signedUrl || null;
    } catch (err) {
      console.error("Exception while signing path:", path, err);
      return null;
    }
  })
);

      return {
        ...service,
        vendor: vendorInfo || {},
        service_rating: ratingInfo || {},
        signed_photo_urls: signedPhotos.filter(Boolean),
      };
    })
  );


  const filtered = enriched.filter(item => {
    const vendorExperience = item.vendor?.experience?.toLowerCase() || "";
    const selectedExperience = experience?.toLowerCase() || "";

    const ratingMatch = !rating || (item.service_rating?.rating ?? 0) >= rating;
    const experienceMatch = !experience || vendorExperience.includes(selectedExperience);

    return ratingMatch && experienceMatch;
  });

  return NextResponse.json(filtered);
}