import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📦 Incoming body:", body);
    const { conversationId, senderId, content, messageType = "text" } = body;

    if (!conversationId || !senderId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user")
      .select()
      .eq("clerk_user_id", senderId);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const id = data?.[0].id;

    const { error: msgError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: id,
      content,
      message_type: messageType,
    });

    if (msgError) {
      return NextResponse.json({ error: msgError.message }, { status: 500 });
    }

    const { error: convError } = await supabase
      .from("conversations")
      .update({
        last_message: content,
        last_message_time: new Date(),
      })
      .eq("id", conversationId);

    if (convError) {
      return NextResponse.json({ error: convError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
