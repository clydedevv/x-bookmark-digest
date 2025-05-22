import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { postTweet } from '@/lib/twitter';
import { z } from 'zod';

const tweetSchema = z.object({
  text: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = session as any;
    const twitterToken = (token as any).twitterToken;

    if (!twitterToken) {
      return NextResponse.json({ error: 'Twitter token not found' }, { status: 400 });
    }

    const data = await request.json();
    const validation = tweetSchema.safeParse(data);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const tweet = await postTweet(twitterToken, validation.data.text);

    return NextResponse.json({ tweet });
  } catch (error) {
    console.error('Error posting tweet:', error);
    return NextResponse.json({ error: 'Failed to post tweet' }, { status: 500 });
  }
}

