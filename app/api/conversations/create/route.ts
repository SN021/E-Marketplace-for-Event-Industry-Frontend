import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabase
    .from("user")
    .select()
    .eq("clerk_user_id", userId);

  const id = userData?.[0].id;

  const body = await request.json();

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
    sender_id: id,
    content: initialMessage,
    message_type: "text",
  });

  if (msgErr) {
    return NextResponse.json({ error: msgErr.message }, { status: 500 });
  }

  return NextResponse.json({ conversationId: newConv.id }, { status: 200 });
}
