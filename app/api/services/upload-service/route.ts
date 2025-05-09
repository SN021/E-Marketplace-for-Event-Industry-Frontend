import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);



export async function POST(req: NextRequest) {

  const formData = await req.formData();
  const files = formData.getAll('images') as File[];

  if (files.length < 2 || files.length > 4) {
    return NextResponse.json({ error: 'Must upload 2 to 4 images.' }, { status: 400 });
  }

  const uploadedPaths: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `photo-gallery/${randomUUID()}-${file.name}`;

    const { error } = await supabase.storage
      .from('vendor-assets')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    uploadedPaths.push(filename);
  }

  return NextResponse.json({ paths: uploadedPaths });
}
