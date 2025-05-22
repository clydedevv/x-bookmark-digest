import OpenAI from 'openai';
import type { Bookmark } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDigestSummary(bookmarks: Bookmark[], prompt?: string) {
  try {
    // Create a comprehensive content from the bookmarks
    const bookmarkContent = bookmarks.map(bookmark => {
      return `Tweet by @${bookmark.authorUsername} (${bookmark.authorName}):
      
${bookmark.content}

URL: ${bookmark.url}
---`;
    }).join('\n\n');

    // Default prompt if none provided
    const defaultPrompt = `You are a helpful assistant that creates concise digests from a collection of tweets. 
    
Generate a well-organized digest that summarizes the key information, insights, and action items from these tweets. 
Organize the content by themes or topics, and highlight the most valuable information.

Include the following sections:
1. Key Themes
2. Notable Insights
3. Action Items & Takeaways
`;

    const finalPrompt = prompt || defaultPrompt;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: finalPrompt },
        { role: "user", content: bookmarkContent }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating digest with OpenAI:', error);
    throw error;
  }
}

export async function categorizeBookmarks(bookmarks: Bookmark[]) {
  try {
    // Create a list of bookmarks to categorize including tweet IDs so the LLM
    // can return them in the response
    const bookmarksList = bookmarks
      .map((bookmark) => {
        return `Tweet ID: ${bookmark.tweetId}\nTweet by @${bookmark.authorUsername}:\n${bookmark.content}`;
      })
      .join('\n\n');

    const prompt = `
    You are a helpful assistant that analyzes and categorizes tweets. 
    For each tweet, assign the most relevant categories or tags from this list:
    
    - Tech
    - Business
    - Marketing
    - Personal Development
    - Writing
    - Design
    - Finance
    - AI
    - Career
    - Health
    - Productivity
    
    You can assign multiple tags if appropriate. Return your response as a JSON array with this format:
    [
      {
        "tweetId": "id_of_the_tweet",
        "tags": ["tag1", "tag2"]
      }
    ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: bookmarksList }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error('Error categorizing bookmarks with OpenAI:', error);
    throw error;
  }
} 