import { NextApiRequest, NextApiResponse } from 'next';
import { Webhook } from 'svix';
import { buffer } from 'micro'; 
import { createClient } from '@supabase/supabase-js';

// Supabase client (Service role key gives full DB access)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Disable Next.js body parsing to get the raw body for svix
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
  const svix = new Webhook(WEBHOOK_SECRET);

  // Get the raw body
  const payload = (await buffer(req)).toString();

  // Get headers in the expected format
  const headers = req.headers;

  const svixHeaders = {
    "svix-id": headers["svix-id"] as string,
    "svix-timestamp": headers["svix-timestamp"] as string,
    "svix-signature": headers["svix-signature"] as string,
  };

  let evt: { type: string; data: any };

  try {
    evt = svix.verify(payload, svixHeaders) as { type: string; data: any };
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const { type, data } = evt;

  console.log(`🔔 Received Clerk webhook: ${type}`);

  // Handle different webhook types
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
      console.error('Error inserting user:', error);
      return res.status(500).json({ message: 'Supabase insert failed' });
    }

    console.log('✅ User inserted into Supabase');
  }

  if (type === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses?.[0]?.email_address;

    const { error } = await supabase
      .from('user')
      .update({
        email,
        first_name,
        last_name,
      })
      .eq('clerk_user_id', id);

    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Supabase update failed' });
    }

    console.log('✅ User updated in Supabase');
  }

  if (type === 'user.deleted') {
    const { id } = data;

    const { error } = await supabase
      .from('user')
      .delete()
      .eq('clerk_user_id', id);

    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Supabase delete failed' });
    }

    console.log('✅ User deleted from Supabase');
  }

  return res.status(200).json({ message: 'Webhook processed' });
};

export default handler;
