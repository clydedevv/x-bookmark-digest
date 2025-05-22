import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { exportDigestToNotion } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { digestId } = await request.json();
    if (!digestId) {
      return NextResponse.json({ error: 'Missing digestId' }, { status: 400 });
    }

    const digest = await prisma.digest.findUnique({
      where: { id: digestId, userId: session.user.id },
      include: {
        items: {
          include: { bookmark: true },
        },
      },
    });

    if (!digest) {
      return NextResponse.json({ error: 'Digest not found' }, { status: 404 });
    }

    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { error: 'Notion integration not configured' },
        { status: 500 },
      );
    }

    await exportDigestToNotion(digest, apiKey, databaseId);

    return NextResponse.json({ message: 'Digest exported to Notion' });
  } catch (error) {
    console.error('Error exporting digest to Notion:', error);
    return NextResponse.json(
      { error: 'Failed to export digest' },
      { status: 500 },
    );
  }
}
