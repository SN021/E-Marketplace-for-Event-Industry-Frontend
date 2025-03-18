import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

// 1) Force Node.js runtime so we can use 'svix' (signature verification)
export const runtime = 'nodejs';

// 2) Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 3) Clerk uses Svix signatures → must read raw text
    const payload = await req.text();

    // 4) Grab the required Svix headers from Clerk
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('❌ Missing Svix headers');
      return NextResponse.json({ message: 'Missing Svix headers' }, { status: 400 });
    }

    // 5) Verify Clerk event
    const svix = new Webhook(process.env.SIGNING_SECRET!);
    const evt = svix.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as { type: string; data: any };

    const { type, data } = evt;
    console.log(`✅ Webhook event: ${type}`);

    // 6) user.created → Insert user into 'user' table
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

      console.log('✅ User inserted in Supabase');
    }

    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
  } catch (err) {
    console.error('❌ Webhook Error:', err);
    return NextResponse.json({ message: 'Webhook error' }, { status: 400 });
  }
}

// Optional: If you want to block GET, or return 405 for other methods
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
