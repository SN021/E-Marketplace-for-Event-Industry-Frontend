import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
	const { userId } = await auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const url = new URL(req.url);
	const id = url.pathname.split("/").pop(); // or use `req.nextUrl.pathname`

	if (!id) {
		return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
	}

	const { data, error } = await supabase
		.from("services")
		.select("*")
		.eq("service_id", id)
		.maybeSingle();

	if (error || !data) {
		return NextResponse.json({ error: "Service not found" }, { status: 404 });
	}

	return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
	const { userId } = await auth();
	const body = await req.json();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const url = new URL(req.url);
	const id = url.pathname.split("/").pop();

	if (!id) {
		return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
	}

	const updates = {
		description: body.service_description,
		service_title: body.service_title,
		price_features: body.price_features,
		starting_price: body.starting_price,
		discounts_and_offers: body.discounts_and_offers,
		serviceable_areas: body.servicable_areas,
		notice_period: body.notice_period,
		policies: body.cancellation_policy,
		other_details: body.other_details,
		search_tags: body.search_tags,
		updated_at: new Date().toISOString(),
	};

	const { data, error } = await supabase
		.from("services")
		.update(updates)
		.eq("service_id", id)
		.select()
		.maybeSingle();

	if (error) {
		console.error("Supabase update error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
  }

  const { data: convos, error: conversationError } = await supabase
    .from("conversations")
    .select("id")
    .eq("service_id", id);

  const convoId = convos?.[0]?.id;

  const deleteSteps = [
    convoId && supabase.from("offers").delete().eq("conversation_id", convoId),
    convoId && supabase.from("messages").delete().eq("conversation_id", convoId),
    convoId && supabase.from("conversations").delete().eq("service_id", id),
    supabase.from("service_rating").delete().eq("service_id", id),
    supabase.from("saved_services").delete().eq("service_id", id),
    supabase.from("services").delete().eq("service_id", id),
  ].filter(Boolean); 

  for (const step of deleteSteps) {
    const { error } = await step;
    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Service deleted successfully." });
}

