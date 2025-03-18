import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;
  if (!SIGNING_SECRET) {
    throw new Error('Error: SIGNING_SECRET not set');
  }

  const wh = new Webhook(SIGNING_SECRET);

  // ❌ Don't do: await headers()
  // ✅ Do it synchronously
  const h = headers();
  const svixId = (await h).get('svix-id');
  const svixTimestamp = (await h).get('svix-timestamp');
  const svixSignature = (await h).get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing Svix headers', { status: 400 });
  }

  // Read the request body as JSON
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error('Verification error:', error);
    return new Response('Verification error', { status: 400 });
  }

  // Example: handle user.created
  if (evt.type === 'user.created') {
    // do something with evt.data
    console.log('A new user was created!', evt.data.id);
  }

  return new Response('Webhook received', { status: 200 });
}
