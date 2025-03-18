import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; 
// Force Node.js runtime so we can do typical Node stuff (if needed later).

export async function POST(req: NextRequest) {
  console.log('** Minimal route: POST received **');
  return NextResponse.json({ message: 'Got POST successfully!' }, { status: 200 });
}

export async function GET() {
  // Optional: If you hit GET in the browser, it returns 405
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
