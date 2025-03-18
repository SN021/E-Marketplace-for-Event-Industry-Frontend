import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// 1) Force Node.js runtime so we can use 'svix' or DB libs
export const runtime = 'nodejs';

// 2) Initialize Supabase (or any DB) if you need it
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 3) POST route for Clerk webhooks
export async function POST(req: NextRequest) {
  try {
    // Clerk requires a "raw body" for signature verification
    // The official approach is to read JSON, then stringify.
    const payload = await req.json(); // read as JSON
    const body = JSON.stringify(payload);

    // 4) Extract Svix headers
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { message: 'Bad request -- missing Svix headers' },
        { status: 400 }
      );
    }

    // 5) Verify signature using the Clerk webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('CLERK_WEBHOOK_SECRET is not set');
    }

    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json({ message: 'Bad request' }, { status: 400 });
    }

    // 6) Check the event type
    const eventType = evt.type;
    console.log('✅ Clerk webhook event type:', eventType);

    if (eventType === 'user.created') {
      // The Clerk user data
      const { id, email_addresses, first_name, last_name, username } = evt.data;
      const email = email_addresses?.[0]?.email_address;

      // Example: Insert into your DB (Supabase, etc.)
      const { error } = await supabase.from('user').insert([
        {
          clerk_user_id: id,
          email,
          username,
          first_name,
          last_name,
        },
      ]);

      if (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
      }

      console.log('✅ User created/updated in DB successfully.');
    }

    // 7) Return 2xx to avoid Clerk retries
    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
