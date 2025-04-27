import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { service_id, user_id, rating, review } = body;

  if (!service_id || !user_id || rating === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const cleanReview = typeof review === "string" && review.trim() !== "" ? review.trim() : null;

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

  if (existingReview) {
    return NextResponse.json(
      { error: "You have already reviewed this service." },
      { status: 409 }
    );
  }

  const { data: insertedReview, error: insertError } = await supabase
    .from("service_rating")
    .insert({
      service_id,
      user_id,
      rating,
      review: cleanReview,
    })
    .select("*")
    .maybeSingle();

  if (insertError) {
    console.error("Insert review error:", insertError.message);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }


  const { data: allRatingsData, error: ratingsError } = await supabase
    .from("service_rating")
    .select("rating")
    .eq("service_id", service_id);

  if (ratingsError) {
    console.error("Fetch ratings error:", ratingsError.message);
    return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 });
  }

  const ratings = allRatingsData.map((r) => r.rating);
  const averageRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : null;

  const { error: updateError } = await supabase
    .from("services")
    .update({ average_rating: averageRating })
    .eq("service_id", service_id);

  if (updateError) {
    console.error("Update service rating error:", updateError.message);
    return NextResponse.json({ error: "Failed to update service rating" }, { status: 500 });
  }

  return NextResponse.json({
    message: "Review submitted successfully",
    review: insertedReview,
    averageRating, 
  });
}
