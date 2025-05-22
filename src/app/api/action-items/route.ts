import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { mockBookmarks } from '@/lib/mockData';
import OpenAI from 'openai';

// Define the Bookmark interface based on our schema
interface Bookmark {
  id: string;
  tweetId: string;
  content: string;
  authorName: string;
  authorUsername: string;
  authorImage?: string | null;
  url: string;
  userId: string;
}

// Flag for testing with mock data
const USE_MOCK_DATA = false;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // For testing purposes, use mock data
    if (USE_MOCK_DATA) {
      // Mock response for action items
      const actionItems = {
        actionItems: [
          "Research SaaS metrics tracking tools mentioned in the bookmarks",
          "Implement the React performance optimization techniques from reactexpert's tweet",
          "Check out the new product launched by ProductHunt",
          "Follow up on the SaaS business thread to learn more about retention strategies"
        ],
        insights: [
          "You're particularly interested in SaaS business models and growth strategies",
          "Technical optimization seems to be a focus area for you",
          "You save content related to product launches and innovation",
          "You're building a knowledge base on modern development practices"
        ],
        userProfile: {
          interests: ["SaaS", "React", "Product Development", "Performance Optimization"],
          suggestedTags: ["Tech", "Business", "Development", "Product"],
          roast: "You seem to bookmark a lot about optimizing things, but when was the last time you actually implemented any of these 'life-changing' techniques? Maybe your bookmark collection needs some optimization too!"
        }
      };
      
      return NextResponse.json(actionItems);
    }
    
    const data = await request.json();
    const { bookmarkIds } = data;
    
    if (!bookmarkIds || !Array.isArray(bookmarkIds) || bookmarkIds.length === 0) {
      return NextResponse.json({ error: 'No bookmark IDs provided' }, { status: 400 });
    }
    
    // Get bookmarks from database
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        id: { in: bookmarkIds },
        userId: session.user.id,
      },
    });
    
    if (bookmarks.length === 0) {
      return NextResponse.json({ error: 'No valid bookmarks found' }, { status: 400 });
    }
    
    // Create content for OpenAI
    const bookmarkContent = bookmarks.map((bookmark: Bookmark) => {
      return `Tweet by @${bookmark.authorUsername}:
${bookmark.content}`;
    }).join('\n\n');
    
    // Call OpenAI to generate action items
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: `You are an assistant that analyzes a user's Twitter bookmarks and extracts valuable information. 
          Based on the bookmarks, generate:
          
          1. A list of 3-5 specific action items the user should take
          2. 3-5 insights about the user's interests and focus areas
          3. A brief profile of the user including their main interests, suggested tags, and a friendly roast about their content consumption habits
          
          Return your response as a JSON object with these keys: actionItems (array), insights (array), and userProfile (object with keys: interests, suggestedTags, roast)`
        },
        { role: "user", content: bookmarkContent }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });
    
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating action items:', error);
    return NextResponse.json({ error: 'Failed to generate action items' }, { status: 500 });
  }
} 