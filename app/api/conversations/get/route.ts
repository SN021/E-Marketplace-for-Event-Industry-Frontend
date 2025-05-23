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

  const { data: userData, error: userError } = await supabase
    .from("user")
    .select()
    .eq("clerk_user_id", userId);

  if (userError || !userData || userData.length === 0) {
    return NextResponse.json(
      { message: "User not found or database error" },
      { status: 500 }
    );
  }

  const id = userData[0].id;

  const { data, error, count } = await supabase
    .from("conversations")
    .select(
      `
      id,
      last_message,
      last_message_time,
      status,
      service_id,
      service:services ( service_title ),
      client_id,
      vendor_id
    `,
      { count: "exact" } // for total count
    )
    .or(`client_id.eq.${id},vendor_id.eq.${id}`)
    .order("last_message_time", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return NextResponse.json({ conversations: data, totalPages });
}
