import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("community_posts")
    .select(
      `
      post_id,
      title,
      content,
      created_at,
      vendor_id,
      user!community_posts_vendor_id_fkey (
        first_name,
        last_name
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}



export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Missing tile or content" }, { status: 400 });
  }

  const { data: userData, error: userError } = await supabase
    .from("user")
    .select("id , role")
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

  const { error: insertError } = await supabase.from("community_posts").insert([
    {
      title,
      content,
      vendor_id: userData.id,
    },
  ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Post created successfully" }, { status: 200 });
}
