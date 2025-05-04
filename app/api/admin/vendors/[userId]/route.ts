import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;

  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: admin } = await supabase
    .from("user")
    .select("role")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (admin?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: vendor, error } = await supabase
    .from("vendor")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  if (vendor.profile_picture) {
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from("vendor-assets") 
      .createSignedUrl(vendor.profile_picture, 60 * 60); 

    if (!urlError && signedUrlData?.signedUrl) {
      vendor.profile_picture = signedUrlData.signedUrl;
    }
  }

  return NextResponse.json({ vendor });
}
