import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('campus_resources').select('*');
    if (error) throw error;
    return NextResponse.json({ resources: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, resources: [] }, { status: 200 });
  }
}
