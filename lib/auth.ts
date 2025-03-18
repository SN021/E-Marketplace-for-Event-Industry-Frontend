import { getAuth } from '@clerk/nextjs/server';

export const authenticate = (req: any) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return userId;
};
