import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    const { data: allRecords, error: fetchError } = await supabase
      .from('daddies')
      .select('*');

    if (fetchError) {
      console.error('Error fetching records:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch records' },
        { status: 500 }
      );
    }

    const { count, error } = await supabase
      .from('daddies')
      .select('*', { count: 'exact' });

    const finalCount = count ?? allRecords?.length ?? 0;

    return NextResponse.json(
      { count: finalCount },
      {
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 