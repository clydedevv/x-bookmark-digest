import { TwitterApi, UserV2 } from 'twitter-api-v2';
import { prisma } from './prisma';

interface TwitterBookmark {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
}

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

export async function fetchTwitterBookmarks(accessToken: string, userId: string) {
  const twitterClient = new TwitterApi(accessToken);
  
  try {
    // Get bookmarks with user information
    const bookmarksResponse = await twitterClient.v2.bookmarks({
      expansions: ['author_id'],
      'tweet.fields': ['created_at', 'text', 'public_metrics'],
      'user.fields': ['name', 'username', 'profile_image_url'],
      max_results: 100,
    });
    
    const bookmarks = bookmarksResponse.data.data || [];
    const users = bookmarksResponse.data.includes?.users || [];
    
    // Map the users by ID for easy lookup
    const userMap = new Map<string, UserV2>();
    users.forEach(user => userMap.set(user.id, user));
    
    // Create bookmarks in the database
    const createdBookmarks = [];
    
    for (const bookmark of bookmarks) {
      const author = userMap.get(bookmark.author_id);
      
      if (!author) continue;
      
      const bookmarkData = {
        tweetId: bookmark.id,
        content: bookmark.text,
        authorName: author.name,
        authorUsername: author.username,
        authorImage: author.profile_image_url || '',
        url: `https://twitter.com/${author.username}/status/${bookmark.id}`,
        userId,
      };
      
      try {
        // Check if bookmark already exists
        const existingBookmark = await prisma.bookmark.findUnique({
          where: { tweetId: bookmark.id },
        });
        
        if (!existingBookmark) {
          const createdBookmark = await prisma.bookmark.create({
            data: bookmarkData,
          });
          
          createdBookmarks.push(createdBookmark);
        }
      } catch (error) {
        console.error(`Error processing bookmark ${bookmark.id}:`, error);
      }
    }
    
    return createdBookmarks;
  } catch (error) {
    console.error('Error fetching Twitter bookmarks:', error);
    throw error;
  }
} 