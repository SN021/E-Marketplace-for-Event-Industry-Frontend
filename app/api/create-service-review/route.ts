import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {

  const body = await req.json();
  const { service_id, user_id, rating, review } = body;

  if (!service_id || !user_id || rating === undefined || review === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: existingReview, error: fetchError } = await supabase
    .from("service_rating")
    .select("rating_id")
    .eq("service_id", service_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (fetchError) {
    console.error("Check existing review error:", fetchError.message);
    return NextResponse.json({ error: "Failed to check existing review" }, { status: 500 });
  }

  let result;

  if (existingReview) {
    const { data, error } = await supabase
      .from("service_rating")
      .update({ rating, review, updated_at: new Date().toISOString() })
      .eq("rating_id", existingReview.rating_id)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Update review error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    result = data;
  } else {
    const { data, error } = await supabase
      .from("service_rating")
      .insert({ service_id, user_id, rating, review })
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Insert review error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    result = data;
  }

  return NextResponse.json({
    message: existingReview
      ? "Review updated successfully"
      : "Review submitted successfully",
    review: result,
  });
}
