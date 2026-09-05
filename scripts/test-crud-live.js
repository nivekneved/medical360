import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtcywighvyndtoxfvmny.supabase.co';
const supabaseAnonKey = 'sb_publishable_A5Ugg4ZnCDbak0_h8gjy5Q_ZXVauRm0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLiveQueries() {
  console.log('Testing live data retrieval directly from Supabase...');
  
  const [hosp, spec, doc, cs, inq] = await Promise.all([
    supabase.from('hospitals').select('*'),
    supabase.from('specialties').select('*'),
    supabase.from('doctors').select('*'),
    supabase.from('case_studies').select('*'),
    supabase.from('inquiries').select('*'),
  ]);

  console.log(`Hospitals: ${hosp.data?.length} (Error: ${hosp.error?.message || 'none'})`);
  console.log(`Specialties: ${spec.data?.length} (Error: ${spec.error?.message || 'none'})`);
  console.log(`Doctors: ${doc.data?.length} (Error: ${doc.error?.message || 'none'})`);
  console.log(`Case Studies: ${cs.data?.length} (Error: ${cs.error?.message || 'none'})`);
  console.log(`Inquiries: ${inq.data?.length} (Error: ${inq.error?.message || 'none'})`);
}

testLiveQueries();
