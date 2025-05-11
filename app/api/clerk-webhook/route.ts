import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextApiResponse } from "next";


export const runtime = "nodejs";


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST route for Clerk webhooks
export async function POST(req: NextRequest, res: NextApiResponse) {
  try {

    const payload = await req.json();
    const body = JSON.stringify(payload);


    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { message: "Bad request -- missing Svix headers" },
        { status: 400 }
      );
    }

   
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    // Check the event type
    const eventType = evt.type;
    console.log("Clerk webhook event type:", eventType);

    if (eventType === "user.created") {
      // The Clerk user data
      const { id, email_addresses, username, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address;

      // Insert into your DB
      const { error } = await supabase.from("user").insert([
        {
          clerk_user_id: id,
          email,
          username,
          first_name,
          last_name,
          is_vendor: false,
        },
      ]);

      if (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
          { message: "Error creating user" },
          { status: 500 }
        );
      }
      console.log("User created in DB successfully.");
    } else if (eventType === "user.updated") {
      // The Clerk user data
      const { id, email_addresses, username, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address;

      // Update existing DB record by clerk_user_id
      const { error } = await supabase
        .from("user")
        .update({
          email,
          username,
          first_name,
          last_name,
        })
        .eq("clerk_user_id", id);

      if (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
          { message: "Error updating user" },
          { status: 500 }
        );
      }
      console.log("User updated in DB successfully.");
    } else if (eventType === "user.deleted") {
      // The Clerk user ID
      const { id } = evt.data;

      const { data: userData, error: userError } = await supabase
        .from("user")
        .select()
        .eq("clerk_user_id", id);

      const userId = userData?.[0].id;

      // Delete community comments
      await supabase
        .from("community_comments")
        .delete()
        .eq("vendor_id", userId);

      // Delete community posts
      await supabase.from("community_posts").delete().eq("vendor_id", userId);

      // Delete service ratings
      await supabase.from("service_rating").delete().eq("user_id", userId);

      // Delete saved services
      await supabase.from("saved_services").delete().eq("user_id", userId);

      // Delete offers (you already have ON DELETE CASCADE for vendor_id, but still safe to call directly)
      await supabase.from("offers").delete().eq("vendor_id", userId);

      // Delete messages
      await supabase.from("messages").delete().eq("sender_id", userId);

      // Delete conversations (where user is vendor or client)
      await supabase
        .from("conversations")
        .delete()
        .or(`vendor_id.eq.${userId},client_id.eq.${userId}`);

      // Delete services
      await supabase.from("services").delete().eq("user_id", userId);

      // Delete vendor profile
      await supabase.from("vendor").delete().eq("id", userId);

      // Finally, delete the user
      await supabase.from("user").delete().eq("id", userId);

      // Delete from DB by clerk_user_id
      const { error } = await supabase
        .from("user")
        .delete()
        .eq("clerk_user_id", id);

      if (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
          { message: "Error deleting user" },
          { status: 500 }
        );
      }
      console.log(" User deleted from DB successfully.");
    }


    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
