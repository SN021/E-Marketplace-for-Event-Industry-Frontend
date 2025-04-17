import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const type = formData.get("type") as string;
  const userId = formData.get("userId") as string;

  if ( !type || !userId) {
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


  if (type === "profile") {
    const { data, error } = await supabase
      .from('user')
      .select()
      .eq('clerk_user_id', userId);

    const id = data?.[0].id;

    const { data: vendorData, error: vendorError } = await supabase
      .from("vendor")
      .select("*")
      .eq("id", id)
      .maybeSingle();

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('vendor-assets')
        .createSignedUrl(vendorData?.profile_picture, 60 * 60); 

      if (signedUrlError) {
        console.error("Signed URL error:", signedUrlError);
        return NextResponse.json({ error: 'Signed URL generation failed' }, { status: 500 });
      }
      return NextResponse.json(
        signedUrlData,
        { status: 200 }
      );

    }
    
  }

  
