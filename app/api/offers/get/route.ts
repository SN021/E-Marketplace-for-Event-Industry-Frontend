// app/api/vendor-offers/route.ts

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

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Get vendor internal user ID
  const { data: userData, error: userError } = await supabase
    .from("user")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (userError || !userData) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 500 });
  }

  const vendorId = userData.id;

  const { data, error, count } = await supabase
    .from("offers")
    .select(
      `
      id,
      description,
      price,
      status,
      created_at,
      expires_at,
      conversation:conversation_id (
        id,
        client:user!conversations_client_id_fkey (
          first_name,
          last_name,
          email,
          username
        ),
        service:services (
          service_title
        )
      )
    `,
      { count: "exact" }
    )
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching offers with joins:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    offers: data,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
