import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST handler for Clerk Webhook
export async function POST(req: NextRequest) {
  try {
    // Clerk requires raw body for signature verification
    const payload = await req.text();

    // Extract svix headers manually
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ message: 'Missing Svix headers' }, { status: 400 });
    }

    const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

    const evt = svix.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as { type: string; data: any };

    const { type, data } = evt;

    console.log(`✅ Webhook Event Type: ${type}`);

    if (type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses?.[0]?.email_address;

      const { error } = await supabase.from('user').insert([
        {
          clerk_user_id: id,
          email,
          first_name,
          last_name,
        },
      ]);

      if (error) {
        console.error('❌ Supabase Insert Error:', error);
        return NextResponse.json({ message: 'Supabase insert error' }, { status: 500 });
      }

      console.log('✅ User Created in Supabase');
    }

    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ message: 'Webhook error' }, { status: 400 });
  }
}
