import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Get user ID from 'user' table
    const { data: userData, error: userError } = await supabase
    .from("user")
    .select()
    .eq("clerk_user_id",userId);

    if (userError) {
    console.error("User fetch error:", userError);
    }

    const id = userData?.[0].id;

    const { data: vendorData, error: vendorError } = await supabase
    .from("vendor")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (vendorError) {
    console.error("Supabase error:", vendorError);
    return NextResponse.json({ error: vendorError.message }, { status: 500 });
  }

  return NextResponse.json(vendorData);
}
