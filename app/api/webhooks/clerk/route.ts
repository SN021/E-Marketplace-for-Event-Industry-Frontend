import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 1) Force Node.js runtime so we can use 'svix', 'pg', etc.
 *    (If you omit this, Next.js might use the Edge runtime,
 *    which can cause issues with certain Node libraries.)
 */
export const runtime = 'nodejs';

/**
 * 2) Initialize Supabase (Optional)
 *    - If you want to sync new users to your DB.
 */
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * 3) Handle Clerk Webhook events.
 *    - In Clerk’s docs, the recommended secret is SIGNING_SECRET.
 */
export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  // Make sure your secret is set in your .env or hosting environment
  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env'
    );
  }

  // 4) Create new Svix instance with your signing secret
  const wh = new Webhook(SIGNING_SECRET);

  // 5) Get the headers from `next/headers` (App Router)
  const h = headers();
  const svixId = h.get('svix-id');
  const svixTimestamp = h.get('svix-timestamp');
  const svixSignature = h.get('svix-signature');

  // 6) If headers are missing, respond with 400
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // 7) Read the body as JSON
  const payload = await req.json();
  // Convert to string for verification
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;
  try {
    // 8) Verify the webhook signature
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // 9) Log or process the data
  console.log(`✅ Received webhook with ID: ${evt.data.id}`);
  console.log(`Event type: ${evt.type}`);
  console.log('Webhook payload:', body);

  // 10) If you want type-safe logic for user.created
  if (evt.type === 'user.created') {
    // @ts-ignore
    const userId = evt.data.id;
    // @ts-ignore
    const email = evt.data.email_addresses?.[0]?.email_address;

    // Example: Insert new user in Supabase
    const { error } = await supabase.from('user').insert([
      {
        clerk_user_id: userId,
        email,
      },
    ]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return new Response('Database error', { status: 500 });
    }
    console.log('✅ User inserted in DB');
  }

  // Return a 2xx so Clerk knows we processed it
  return new Response('Webhook received', { status: 200 });
}
