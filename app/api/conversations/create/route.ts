import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase"; // adjust this if needed

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { userId } = getAuth(request);

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

  const body = await request.json();

  console.log(body)

  const { vendorId, serviceId, initialMessage } = body;

  if (!id || !vendorId || !serviceId || !initialMessage) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data: existingConv, error: findErr } = await supabase
    .from("conversations")
    .select("id")
    .eq("client_id", id)
    .eq("vendor_id", vendorId)
    .eq("service_id", serviceId)
    .maybeSingle();

  if (findErr) {
    return NextResponse.json({ error: findErr.message }, { status: 500 });
  }

  if (existingConv) {
    return NextResponse.json(
      { conversationId: existingConv.id },
      { status: 200 }
    );
  }

  const { data: newConv, error: convErr } = await supabase
    .from("conversations")
    .insert({
      client_id: id,
      vendor_id: vendorId,
      service_id: serviceId,
      last_message: initialMessage,
      last_message_time: new Date(),
      status: "active",
    })
    .select()
    .single();

  if (convErr) {
    return NextResponse.json({ error: convErr.message }, { status: 500 });
  }

  const { error: msgErr } = await supabase.from("messages").insert({
    conversation_id: newConv.id,
    sender_id: userId,
    content: initialMessage,
    message_type: "text",
  });

  if (msgErr) {
    return NextResponse.json({ error: msgErr.message }, { status: 500 });
  }

  return NextResponse.json({ conversationId: newConv.id }, { status: 200 });
}
