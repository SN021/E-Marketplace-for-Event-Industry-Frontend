import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabase
    .from("user")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (userError || !userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const dbUserId = userData.id;
  const { id: conversationId } = await context.params; 


  const { data: conversation, error } = await supabase
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
    .eq("id", conversationId)
    .or(`client_id.eq.${dbUserId},vendor_id.eq.${dbUserId}`)
    .single();

  if (error || !conversation) {
    return NextResponse.json(
      { error: "Conversation not found or unauthorized" },
      { status: 404 }
    );
  }

  return NextResponse.json({ conversation });
}
