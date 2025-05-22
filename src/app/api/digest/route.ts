import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { generateDigestSummary } from '@/lib/openai';
import { z } from 'zod';

const createDigestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  bookmarkIds: z.array(z.string()).min(1),
  schedule: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate request data
    const validation = createDigestSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }
    
    const { name, description, bookmarkIds, schedule } = validation.data;
    
    // Fetch the bookmarks from the database
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        id: { in: bookmarkIds },
        userId: session.user.id,
      },
    });
    
    if (bookmarks.length === 0) {
      return NextResponse.json({ error: 'No valid bookmarks found' }, { status: 400 });
    }
    
    // Generate a summary using OpenAI
    const summary = await generateDigestSummary(bookmarks);
    
    // Create the digest
    const digest = await prisma.digest.create({
      data: {
        name,
        description: description || summary?.substring(0, 200) || '',
        schedule,
        userId: session.user.id,
        items: {
          create: bookmarkIds.map(bookmarkId => ({
            bookmark: {
              connect: { id: bookmarkId },
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            bookmark: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      digest,
      summary,
    });
  } catch (error) {
    console.error('Error creating digest:', error);
    return NextResponse.json({ error: 'Failed to create digest' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get all digests for the user
    const digests = await prisma.digest.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            bookmark: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json({ digests });
  } catch (error) {
    console.error('Error fetching digests:', error);
    return NextResponse.json({ error: 'Failed to fetch digests' }, { status: 500 });
  }
} 