import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;
  const { searchParams } = req.nextUrl;

  // Default to page 1 and 5 items per page if not specified
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const order = searchParams.get('order') || 'desc';

  // Calculate offset
  const offset = (page - 1) * limit;

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("community_comments")
    .select(
      `
      comment_id,
      content,
      created_at,
      vendor_id,
      user:vendor_id (
        first_name,
        last_name
      )
    `,
    { count: 'exact' }
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: order === 'asc' })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
