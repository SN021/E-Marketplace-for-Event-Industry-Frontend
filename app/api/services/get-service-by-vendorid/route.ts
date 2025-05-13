import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Get user ID from 'user' table
    const { data: userData, error: userError } = await supabase
    .from("user")
    .select("id")
    .eq("clerk_user_id",userId);

    if (userError) {
    console.error("User fetch error:", userError);
    }

    const id = userData?.[0].id;

    const { data: vendorData, error: vendorError } = await supabase
    .from("vendor")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (vendorError) {
    console.error("Supabase error:", vendorError);
    return NextResponse.json({ error: vendorError.message }, { status: 500 });
  }


  const { data: services, error: serviceError } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', id); 

  if (serviceError) {
    return NextResponse.json({ error: serviceError.message }, { status: 500 });
  }

    const signedServices = await Promise.all(
    services.map(async (service) => {
      let thumbnailUrl: string | null = null;

      try {
        const gallery: string[] = JSON.parse(service.photo_gallery_paths || "[]");
        const firstImagePath = gallery?.[0];

        if (firstImagePath) {
          const { data, error } = await supabase.storage
            .from("vendor-assets")
            .createSignedUrl(firstImagePath, 60 * 60); 

          if (!error && data?.signedUrl) {
            thumbnailUrl = data.signedUrl;
          }
        }
      } catch (err) {
        console.warn("Invalid photo_gallery_paths JSON for service", service.service_id);
      }

      return {
        ...service,
        thumbnail_url: thumbnailUrl,
      };
    })
  );

  return NextResponse.json(signedServices);
}
