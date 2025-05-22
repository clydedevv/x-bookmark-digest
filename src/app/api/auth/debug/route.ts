import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const params = new URL(request.url).searchParams;
    const error = params.get('error');
    const code = params.get('code');
    const state = params.get('state');
    
    return NextResponse.json({
      message: 'OAuth Debug Info',
      isAuthenticated: !!session,
      session: session,
      requestInfo: {
        url: request.url,
        error,
        code,
        state,
      },
      envVars: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        twitterIdSet: !!process.env.TWITTER_CLIENT_ID,
        twitterSecretSet: !!process.env.TWITTER_CLIENT_SECRET,
      }
    });
  } catch (error) {
    console.error('Debug route error:', error);
    return NextResponse.json({ error: 'Internal debug error' }, { status: 500 });
  }
} 