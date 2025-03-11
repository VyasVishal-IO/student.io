// File: app/api/verify-secret-key/route.ts (for App Router)

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' }, 
        { status: 405 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    if (!body || typeof body.key !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request body' }, 
        { status: 400 }
      );
    }
    
    const { key } = body;
    
    // Get the secret key from environment variables
    const validSecretKey = process.env.ROLE_SECRET_KEY;
    
    if (!validSecretKey) {
      console.error('ROLE_SECRET_KEY is not defined in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' }, 
        { status: 500 }
      );
    }
    
    // Use a constant-time comparison to prevent timing attacks
    // This is more secure than a simple equality check
    const isValid = constantTimeCompare(key, validSecretKey);
    
    // Add a small delay to prevent brute force attacks
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Error verifying secret key:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Constant-time comparison function to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

// For Edge Runtime support (optional)
export const config = {
  runtime: 'edge',
};