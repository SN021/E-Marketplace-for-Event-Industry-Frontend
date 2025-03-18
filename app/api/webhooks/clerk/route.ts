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


  return new Response(payload, { status: 200 });
}
