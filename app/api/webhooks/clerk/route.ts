import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // 1) Read the request body as JSON
    const payload = await req.json();
    // Convert to string for signature verification
    const rawBody = JSON.stringify(payload);

    // 2) Grab the Svix headers
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { message: 'Missing Svix headers' },
        { status: 400 }
      );
    }

    // 3) Ensure you have your Clerk Webhook Secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('CLERK_WEBHOOK_SECRET not set');
    }

    // 4) Verify the request came from Clerk
    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(rawBody, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json({ message: 'Verification failed' }, { status: 400 });
    }

    // 5) Log the event to see if it works
    console.log(`✅ Verified Clerk Webhook - Type: ${evt.type}`);
    console.log('Event Data:', evt.data);

    // 6) Just return the event data so you can see it in the response
    return NextResponse.json(
      {
        message: 'Webhook processed successfully',
        eventType: evt.type,
        eventData: evt.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ message: 'Webhook error' }, { status: 400 });
  }
}
