import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { PostgrestError } from '@supabase/supabase-js';

// Create a Supabase client with the service role key
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

export async function POST(request: Request) {
  try {
    const { wallet_address, email } = await request.json();

    if (!wallet_address || !email) {
      return NextResponse.json(
        { error: 'Wallet address and email are required' },
        { status: 400 }
      );
    }

    try {
      // First check if the wallet address already exists
      const { data: existingUser } = await supabase
        .from('daddies')
        .select('wallet_address')
        .eq('wallet_address', wallet_address)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: 'Wallet address already registered' },
          { status: 409 }
        );
      }

      // Check if email already exists
      const { data: existingEmail } = await supabase
        .from('daddies')
        .select('email')
        .eq('email', email)
        .single();

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }

      // Attempt to insert the new user
      const { data, error } = await supabase
        .from('daddies')
        .insert([
          {
            wallet_address,
            email,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        data: {
          wallet_address: data.wallet_address,
          created_at: data.created_at
        }
      });
    } catch (error: unknown) {
      console.error('Supabase error:', error);
      
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        return NextResponse.json(
          { error: 'This wallet address or email is already registered' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to register user', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 