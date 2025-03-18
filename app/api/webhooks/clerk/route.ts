import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function POST() {

  return new Response('Webhook received', { status: 200 });
}
