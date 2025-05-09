import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const { service_id } = await req.json();

  if (!userId || !service_id) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const { data: userData, error: userError } = await supabase
    .from("user") 
    .select("id")
    .eq("clerk_user_id", userId) 
    .maybeSingle();

  if (userError || !userData) {
    console.error("User lookup error:", userError?.message);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const internalUserId = userData.id;

  const { data: existing } = await supabase
    .from("saved_services")
    .select("*")
    .eq("user_id", internalUserId)
    .eq("service_id", service_id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("saved_services")
      .delete()
      .eq("user_id", internalUserId)
      .eq("service_id", service_id);
    return NextResponse.json({ message: "Unsaved" });
  } else {
    await supabase.from("saved_services").insert({ user_id: internalUserId, service_id });
    return NextResponse.json({ message: "Saved" });
  }
}
