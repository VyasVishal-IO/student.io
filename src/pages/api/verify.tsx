// File: pages/api/verify-secret-key.ts (or app/api/verify-secret-key/route.ts for App Router)

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    
    // Get the secret key from environment variables
    const validSecretKey = process.env.ROLE_SECRET_KEY;
    
    if (!validSecretKey) {
      console.error('ROLE_SECRET_KEY is not defined in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' }, 
        { status: 500 }
      );
    }
    
    // Compare the provided key with the valid key
    const isValid = key === validSecretKey;
    
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Error verifying secret key:', error);
    return NextResponse.json(
      { error: 'Invalid request' }, 
      { status: 400 }
    );
  }
}