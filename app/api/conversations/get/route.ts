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

  const { data: UserDate, error: UserError } = await supabase
    .from("user")
    .select()
    .eq("clerk_user_id", userId);

  if (UserError) {
    console.error("Supabase query error:", UserError);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }

  if (!UserDate || UserDate.length === 0) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const id = UserDate?.[0].id;

  const { data, error } = await supabase
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
    `
    )
    .or(`client_id.eq.${id},vendor_id.eq.${id}`)
    .order("last_message_time", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ conversations: data });
}
