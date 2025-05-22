import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchTwitterBookmarks } from '@/lib/twitter';
import { prisma } from '@/lib/prisma';
import { mockBookmarks } from '@/lib/mockData';

// Flag for testing with mock data
const USE_MOCK_DATA = false;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // For testing purposes, use mock data
    if (USE_MOCK_DATA) {
      return NextResponse.json({ bookmarks: mockBookmarks });
    }
    
    // Get user bookmarks from database
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        importedAt: 'desc',
      },
    });
    
    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // For testing purposes, return success with mock data
    if (USE_MOCK_DATA) {
      return NextResponse.json({
        message: 'Bookmarks imported successfully',
        count: mockBookmarks.length,
      });
    }
    
    // We need the Twitter access token from the session
    // This assumes we've set it up in the JWT callback
    const token = session as any;
    const twitterToken = token.twitterToken;
    
    if (!twitterToken) {
      return NextResponse.json({ error: 'Twitter token not found' }, { status: 400 });
    }
    
    // Fetch bookmarks from Twitter
    const createdBookmarks = await fetchTwitterBookmarks(twitterToken, session.user.id);
    
    return NextResponse.json({
      message: 'Bookmarks imported successfully',
      count: createdBookmarks.length,
    });
  } catch (error) {
    console.error('Error importing bookmarks:', error);
    return NextResponse.json({ error: 'Failed to import bookmarks' }, { status: 500 });
  }
} 