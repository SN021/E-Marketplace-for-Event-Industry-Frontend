import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { serviceId, metricType } = await req.json();
    console.log(serviceId, metricType)

    if (!serviceId || !metricType) {
      return NextResponse.json({ error: "Missing serviceId or metricType" }, { status: 400 });
    }

    const { data: serviceRow, error: serviceErr } = await supabase
      .from("services")
      .select("user_id")
      .eq("service_id", serviceId)
      .single();

    if (serviceErr || !serviceRow) {
      return NextResponse.json({ error: "Service not found", details: serviceErr }, { status: 404 });
    }

    const vendorId = serviceRow.user_id;

    const { error: funcErr } = await supabase.rpc("increment_vendor_analytics", {
      p_vendor_id: vendorId,
      p_service_id: serviceId,
      p_metric_type: metricType,
    });

    if (funcErr) {
      return NextResponse.json({ error: "Failed to log analytics", details: funcErr }, { status: 500 });
    }

    return NextResponse.json({ message: "Analytics logged" }, { status: 200 });
  } catch (error) {
    console.error("POST /api/analytics error", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Get vendor_id from public.user
    const { data: userRow, error: userErr } = await supabase
      .from("user")
      .select()
      .eq("clerk_user_id", clerkId);

    if (userErr || !userRow || userRow.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const vendorId = userRow[0].id;

    // Parse timeframe from query string
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") ?? "last_30_days";

    const fromDate =
      timeframe === "last_30_days"
        ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]
        : "1970-01-01";

    // Get analytics data with service_id explicitly included
    const { data: analyticsData, error: analyticsErr } = await supabase
      .from("vw_vendor_analytics")
      .select("metric_type, service_id, service_title, total_count")
      .eq("vendor_id", vendorId)
      .gte("last_seen", fromDate);
      
    if (analyticsErr) {
      return NextResponse.json(
        { error: "Analytics retrieval failed", details: analyticsErr },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      analytics: analyticsData || [],
      vendorId // Return vendorId for debugging/verification
    });
  } catch (error) {
    console.error('Unexpected analytics error:', error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}