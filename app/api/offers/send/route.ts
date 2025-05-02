import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, vendorId, description, price, expiresAt } = body;

    if (!conversationId || !vendorId || !description || !price) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: offer, error: offerError } = await supabase.from('offers').insert({
      conversation_id: conversationId,
      vendor_id: vendorId,
      description,
      price,
      expires_at: expiresAt ? new Date(expiresAt) : null,
    }).select().single();

    if (offerError) {
      return NextResponse.json({ error: offerError.message }, { status: 500 });
    }

    const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: vendorId,
      content: `Offer: ${offer.id}`,
      message_type: "offer",
    });

    if (msgError) {
      return NextResponse.json({ error: msgError.message }, { status: 500 });
    }

    const { error: convError } = await supabase.from('conversations')
      .update({
        last_message: `Offer Sent`,
        last_message_time: new Date(),
        status: "offer_sent"
      })
      .eq('id', conversationId);

    if (convError) {
      return NextResponse.json({ error: convError.message }, { status: 500 });
    }

    return NextResponse.json({ offer }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
