import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';



//setup Supabase server client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

//POST route for Clerk webhooks
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
 // get user details
    const { data, error } = await supabase
    .from('user')
    .select()
    .eq('clerk_user_id', payload.userId);

if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ message: 'Database error' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }



    const id = data?.[0].id;
    const vendorUsername = payload.userName;
    const vendorDisplayname = payload.displayName;
    const email = payload.email;
    const about = payload.about;
    const profilePicture = payload.profilePicture;
    const businessName = payload.businessName;
    const brn = payload.brn;
    const businessAddress = payload.businessAddress;
    const experience = payload.experience;
    const website = payload.website;
    const province = payload.province;
    const city = payload.city;
    const businessEmail = payload.businessEmail;
    const businessPhone = payload.businessPhone;
    const languages = payload.languages;
    const socialLinks = payload.socialLinks;
    const legalDocuments = payload.legalDocuments;
    const nicFront = payload.nicFront;
    const nicBack = payload.nicBack;

    const { error: insertError } = await supabase.from('vendor').insert([{
        id: id,
        vendor_username: vendorUsername,
        display_name: vendorDisplayname,
        email: email,
        about: about,
        business_name: businessName,
        brn: brn,
        business_address: businessAddress,
        experience: experience,
        website: website,
        province: province,
        city: city,
        business_email: businessEmail,
        business_phone: businessPhone,
        languages: languages,
        social_links: socialLinks,
    }]);

    if (insertError) {
        console.error('Vendor insert error:', insertError);
        return NextResponse.json({ message: 'Failed to insert user' }, { status: 500 });
    }


    const { error: updateError } = await supabase
        .from('user')
        .update({
          is_vendor: 'TRUE'
        })
        .eq('id', id);


    if (updateError) {
      console.error('User update error:', updateError);
      return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
    }
  
    return NextResponse.json({ message: 'Success' }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
