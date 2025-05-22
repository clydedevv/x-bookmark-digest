import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { generateUserPersona } from '@/lib/openai';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        // Include any article content if it exists
        article: true as any,
      },
      orderBy: {
        importedAt: 'desc',
      },
    });

    const { persona, insights, actionItems } = await generateUserPersona(bookmarks);

    return NextResponse.json({ persona, insights, actionItems });
  } catch (error) {
    console.error('Error generating user persona:', error);
    return NextResponse.json({ error: 'Failed to generate persona' }, { status: 500 });
  }
}
