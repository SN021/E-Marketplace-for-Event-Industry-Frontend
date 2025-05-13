
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { post_id, content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  const { data: userData, error: userError } = await supabase
    .from("user")
    .select("id, role")
    .eq("clerk_user_id", userId)
    .single();

  if (userError || !userData) {
    console.error("User fetch error:", userError);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const id = userData.id;

  if (userData.role !== "vendor") {
    return NextResponse.json({ error: "Access denied. Only vendors can post." }, { status: 403 });
  }

  const { error: insertError } = await supabase.from("community_comments").insert([
    {
      post_id,
      content,
      vendor_id: userData.id,
    },
  ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Comment shared successfully" }, { status: 200 });
}
