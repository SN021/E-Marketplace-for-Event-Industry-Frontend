import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");

  if (!serviceId) {
    return NextResponse.json({ error: "Missing serviceId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("vendor_analytics")
    .select("count")
    .eq("service_id", serviceId)
    .eq("metric_type", "service_view");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalViews = data.reduce((acc, cur) => acc + cur.count, 0);

  return NextResponse.json({ view_count: totalViews });
}
