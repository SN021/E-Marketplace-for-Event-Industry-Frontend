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

    const { data, error } = await supabase
    .from('user')
    .select()
    .eq('clerk_user_id', payload.userId);

    const id = data?.[0].user_id;
    const serviceTitle= payload.s_title;
    const serviceCategory = payload.s_category;
    const serviceSubcategory = payload.s_subcategory;
    const searchTags = payload.s_tags;
    const serviceDescription = payload.fullDescription;
    const startingPrice = payload.basePrice;
    const staringPricefeature = payload.basePriceFeatures;
    const cancellationRefundpolicy = payload.cancellationPolicy;
    const photoGallery = payload.photoGallery;
    const serviceableAreas = payload.serviceableAreas;
    const noticePeriod = payload.noticePeriod;
    const otherDetails = payload.otherDetails;

    const { error: insertError } = await supabase.from('service').insert([{

    user_id: id,
    service_title:serviceTitle,
    category:serviceCategory,
    subcategory:serviceSubcategory,
    search_tags:searchTags,
    description:serviceDescription,
    staring_price:startingPrice,
    price_features:staringPricefeature,
    policies:cancellationRefundpolicy,
    serviceable_area:serviceableAreas,
    notice_period:noticePeriod,
    other_details:otherDetails,
}]);


  if (insertError) {
        console.error("Insert failed:", insertError.message);
        return NextResponse.json({ message: insertError.message }, { status: 500 });
    }


    return NextResponse.json({ message: 'Success' }, { status: 200 });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }

  }
















