import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

// 1) Force Node.js runtime so we can use 'svix' & raw I/O 
// (the Edge runtime often breaks raw-body usage with 3rd-party libs)
export const runtime = 'nodejs';

// 2) Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 3) Handle POST - the Clerk webhook
export async function POST(req: NextRequest) {
  try {
    // Clerk uses Svix for signature verification, so we need the raw body as text
    const payload = await req.text();

    // 4) Extract Svix signature headers
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('❌ Missing Svix headers');
      return NextResponse.json({ message: 'Missing Svix headers' }, { status: 400 });
    }

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
    const wh = new Webhook(webhookSecret);

    // 5) Verify the signature and parse the event
    const evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as { type: string; data: any };

    const { type, data } = evt;
    console.log(`✅ Clerk Webhook Event Type: ${type}`);

    // 6) Example event: user.created → Insert user in DB
    if (type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses?.[0]?.email_address || null;

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

    // 7) Always return a 2xx so Clerk knows we processed it
    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
  } catch (err) {
    console.error('❌ Webhook handling error:', err);
    // Respond 4xx if something is wrong with the signature, etc.
    return NextResponse.json({ message: 'Webhook error' }, { status: 400 });
  }
}
