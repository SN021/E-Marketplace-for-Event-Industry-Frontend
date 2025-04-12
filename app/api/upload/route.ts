// app/api/upload/vendor-files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as string;
  const userId = formData.get("userId") as string;

  if (!file || !type || !userId) {
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

  const filename = `${type}_${userId}_${Date.now()}`;
  const filePath = `${folder}/${filename}`;

  // Upload file to Supabase Storage 
  const { error: uploadError } = await supabase.storage
    .from('vendor-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }


  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('vendor-assets')
    .createSignedUrl(filePath, 60 * 60); 

  if (signedUrlError) {
    console.error("Signed URL error:", signedUrlError);
    return NextResponse.json({ error: 'Signed URL generation failed' }, { status: 500 });
  }

  return NextResponse.json(
    {
      signedUrl: signedUrlData?.signedUrl,
      filePath, 
    },
    { status: 200 }
  );
}