import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { rating, minPrice, maxPrice, experience, location, query, subcategory, sortOrder, page = 1, limit = 12 } = await req.json();

  let serviceQuery = supabase.from("services").select("*");

  if (minPrice != null) serviceQuery = serviceQuery.gte("starting_price", minPrice);
  if (maxPrice != null) serviceQuery = serviceQuery.lte("starting_price", maxPrice);
    if (query) {
    serviceQuery = serviceQuery.or(
      `service_title.ilike.%${query}%,description.ilike.%${query}%,search_tags.ilike.%${query}%,description.ilike.%${query}%`
    );
  }
  if (subcategory) {serviceQuery = serviceQuery.eq("subcategory", subcategory);}
  if (sortOrder === "asc") {serviceQuery = serviceQuery.order("starting_price", { ascending: true });} 
  else 
  if (sortOrder === "desc") {serviceQuery = serviceQuery.order("starting_price", { ascending: false });}

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  serviceQuery = serviceQuery.range(from, to);

  const { data: services, error } = await serviceQuery;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!services || services.length === 0) {
    return NextResponse.json([]);
  }

  const serviceIds = services.map((s) => s.service_id);
  const userIds = services.map((s) => s.user_id);

  const { data: vendors, error: vendorError } = await supabase
    .from("vendor")
    .select("id, display_name, experience")
    .in("id", userIds);

  if (vendorError) return NextResponse.json({ error: vendorError.message }, { status: 500 });



  const enriched = await Promise.all(
    services.map(async (service) => {
      const vendorInfo = vendors.find((v) => v.id === service.user_id);


      let paths: string[] = [];
      try {
        if (Array.isArray(service.photo_gallery_paths)) {
          paths = service.photo_gallery_paths;
        } else if (typeof service.photo_gallery_paths === "string") {
          paths = JSON.parse(service.photo_gallery_paths);
        }
      } catch (err) {
        console.error("Error parsing photo_gallery_paths:", err);
      }

      const signedPhotos = await Promise.all(
        paths.map(async (path: string) => {
          try {
            const { data, error } = await supabase.storage
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

      const display_name = vendorInfo?.display_name || "Unknown Vendor";

      return {
        ...service,
        vendor: vendorInfo || {},
        signed_photo_urls: signedPhotos.filter(Boolean),
        display_name,
      };
    })
  );

  const filtered = enriched.filter((item) => {
    const vendorExperience = item.vendor?.experience?.toLowerCase() || "";
    const experienceMatch = 
    !experience || experience.length === 0 ||
    (Array.isArray(experience)
      ? experience.some((exp: string) => vendorExperience.includes(exp.toLowerCase()))
      : vendorExperience.includes((experience as string).toLowerCase()));


    const ratingMatch =
      rating == null ||
      (item.average_rating != null && item.average_rating >= rating);


    let locationMatch = true;
    if (location && location.length > 0) {
      try {
        const parsedAreas = JSON.parse(item.serviceable_areas || "[]");
        if (Array.isArray(parsedAreas)) {
          locationMatch =
            parsedAreas.includes("islandwide") ||
            parsedAreas.some((area: string) =>
              location.includes(area)
            );
        } else {
          locationMatch = false;
        }
      } catch (err) {
        console.warn("Invalid serviceable_areas JSON:", item.serviceable_areas);
        locationMatch = false;
      }
    }


    return ratingMatch && experienceMatch && locationMatch;
  });

  return NextResponse.json(filtered);
}