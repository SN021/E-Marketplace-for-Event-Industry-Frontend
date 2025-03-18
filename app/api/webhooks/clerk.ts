import { NextApiRequest, NextApiResponse } from 'next';
import { Webhook } from 'svix';
import { buffer } from 'micro';
import { createClient } from '@supabase/supabase-js';

// Disable body parsing (must be raw)
export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // ✅ Check for POST
  if (req.method !== 'POST') {
    console.log(`❌ Method ${req.method} not allowed`);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // ✅ Get the raw body
  const payload = (await buffer(req)).toString();

  // ✅ Extract svix headers manually
  const headers = req.headers;
  const svixHeaders = {
    "svix-id": headers["svix-id"] as string,
    "svix-timestamp": headers["svix-timestamp"] as string,
    "svix-signature": headers["svix-signature"] as string,
  };

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

  const svix = new Webhook(webhookSecret);

  let evt: { type: string; data: any };

  try {
    evt = svix.verify(payload, svixHeaders) as { type: string; data: any };
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const { type, data } = evt;

  console.log(`✅ Received webhook type: ${type}`);

  // ✅ Do something with the event
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
      console.error('❌ Supabase insert error:', error);
      return res.status(500).json({ message: 'Failed to insert user' });
    }

    console.log('✅ User inserted successfully!');
  }

  // ✅ Success response to Clerk
  return res.status(200).json({ message: 'Webhook received and processed' });
};

export default handler;
