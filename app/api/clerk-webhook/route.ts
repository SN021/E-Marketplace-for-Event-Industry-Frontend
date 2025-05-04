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
    // Clerk uses Svix for signature verification, so we need the raw JSON payload
    const payload = await req.json();
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
      const { id, email_addresses, username, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address;

      // Insert into your DB
      const { error } = await supabase.from('user').insert([{
        clerk_user_id: id,
        email,
        username,      
        first_name,
        last_name,
        is_vendor: false,
      }]);

      if (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
      }
      console.log('✅ User created in DB successfully.');

    } else if (eventType === 'user.updated') {
      // The Clerk user data
      const { id, email_addresses, username, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address;

      // Update existing DB record by clerk_user_id
      const { error } = await supabase
        .from('user')
        .update({
          email,
          username,
          first_name,
          last_name,
        })
        .eq('clerk_user_id', id);

      if (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
      }
      console.log('✅ User updated in DB successfully.');

    } else if (eventType === 'user.deleted') {
      // The Clerk user ID
      const { id } = evt.data;

      // Delete from DB by clerk_user_id
      const { error } = await supabase
        .from('user')
        .delete()
        .eq('clerk_user_id', id);

      if (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
      }
      console.log('✅ User deleted from DB successfully.');
    }

    // 7) Return 2xx so Clerk doesn't retry
    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
