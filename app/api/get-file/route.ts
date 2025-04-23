import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const type = formData.get("type") as string;
  const userId = formData.get("userId") as string;

  if (!type || !userId) {
    return NextResponse.json({ error: 'Missing file or metadata' }, { status: 400 });
  }

  const folderMap: Record<string, string> = {
    profile: 'profile_pictures',
    legal: 'legal_documents',
    nicFront: 'nic_front',
    nicBack: 'nic_back'
  };

  const folder = folderMap[type];
  if (!folder) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }


  const { data: userData, error: userError } = await supabase
    .from('user')
    .select()
    .eq('clerk_user_id', userId);

  const id = userData?.[0]?.id;
  if (!id) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }


  const { data: vendorData, error: vendorError } = await supabase
    .from("vendor")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (vendorError || !vendorData) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
  }

  const filePath = vendorData?.profile_picture;

  if (!filePath) {
    return NextResponse.json({ signedUrl: null }, { status: 200 });
  }

  console.log("Trying to sign path:", filePath);

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('vendor-assets')
    .createSignedUrl(filePath, 60 * 60);

  if (signedUrlError) {
    console.error("Signed URL error:", signedUrlError);
    return NextResponse.json({ signedUrl: null }, { status: 200 });
  }

  return NextResponse.json(
    { signedUrl: signedUrlData.signedUrl },
    { status: 200 }
  );
}
