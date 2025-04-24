import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { service_id } = body;

  if (!service_id) {
    return NextResponse.json({ error: "Missing service_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("service_rating")
    .select("review, rating, created_at, user:user_id(first_name, last_name)")
    .eq("service_id", service_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Review fetch error:", error.message);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }

  return NextResponse.json({ reviews: data });
}
