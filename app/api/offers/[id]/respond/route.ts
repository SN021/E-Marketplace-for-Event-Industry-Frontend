import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const offerId = params.id;
    const body = await req.json();
    const { action } = body; 

    if (!offerId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .update({
        status: action === 'accept' ? 'accepted' : 'declined'
      })
      .eq('id', offerId)
      .select()
      .single();

    if (offerError || !offer) {
      return NextResponse.json({ error: offerError?.message || "Offer not found" }, { status: 500 });
    }

    const { error: convError } = await supabase
      .from('conversations')
      .update({
        status: action === 'accept' ? 'offer_accepted' : 'offer_declined',
        last_message: action === 'accept' ? 'Offer Accepted' : 'Offer Declined',
        last_message_time: new Date()
      })
      .eq('id', offer.conversation_id);

    if (convError) {
      return NextResponse.json({ error: convError.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Offer ${action}ed successfully.` }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
