import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, vendorId, serviceId, initialMessage } = body;

    if (!clientId || !vendorId || !serviceId || !initialMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        client_id: clientId,
        vendor_id: vendorId,
        service_id: serviceId,
        last_message: initialMessage,
        last_message_time: new Date(),
      })
      .select()
      .single();

    if (convError) {
      return NextResponse.json({ error: convError.message }, { status: 500 });
    }

    const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversation.id,
      sender_id: clientId,
      content: initialMessage,
      message_type: 'text',
    });

    if (msgError) {
      return NextResponse.json({ error: msgError.message }, { status: 500 });
    }

    return NextResponse.json({ conversation }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}