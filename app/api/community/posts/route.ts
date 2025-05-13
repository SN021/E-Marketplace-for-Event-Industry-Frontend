import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type User = {
  first_name: string | null;
  last_name: string | null;
};

type RawPost = {
  post_id: string;
  title: string;
  content: string;
  created_at: string;
  vendor_id: string;
  user?: any;
};

type Post = {
  post_id: string;
  title: string;
  content: string;
  created_at: string;
  vendor_id: string;
  user: {
    first_name: string | null;
    last_name: string | null;
  };
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const order = searchParams.get("order") || "desc";
  const sortBy = searchParams.get("sortBy") || "date";

  // Calculate the offset
  const offset = (page - 1) * limit;

  let query = supabase
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
    );

  // Determine sorting column
  let sortColumn = "created_at";
  const isAscending = order === "asc";

  if (sortBy === "title") {
    sortColumn = "title";
  }

  // Apply sorting
  const { data, error } = await query
    .order(sortColumn, { ascending: isAscending })
    .range(offset, offset + limit - 1);

  // Ensure data is always an array with consistent user structure
  const processedData: Post[] = (data as RawPost[] || []).map(post => ({
    ...post,
    user: {
      first_name: post.user?.first_name ?? null,
      last_name: post.user?.last_name ?? null
    }
  }));

  if (error) {
    return NextResponse.json({ error: String(error.message || 'Unknown error') }, { status: 500 });
  }

  return NextResponse.json(processedData);
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json(
      { error: "Missing tile or content" },
      { status: 400 }
    );
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
    return NextResponse.json(
      { error: "Access denied. Only vendors can post." },
      { status: 403 }
    );
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

  return NextResponse.json(
    { message: "Post created successfully" },
    { status: 200 }
  );
}
