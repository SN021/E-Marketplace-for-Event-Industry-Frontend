import { authenticate } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = authenticate(req);


    res.status(200).json({ message: `Authenticated user: ${userId}` });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}
