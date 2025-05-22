import OpenAI from 'openai';
import { TwitterApi } from 'twitter-api-v2';
import { prisma } from '../src/lib/prisma';

async function createPersona(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { importedAt: 'desc' },
    take: 20,
  });

  if (bookmarks.length === 0) {
    throw new Error('No bookmarks found for this user');
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const content = bookmarks.map(b => `${b.content}`).join('\n\n');
  const prompt = `Create a concise persona (max 280 characters) that describes a Twitter user based on their bookmarked tweets.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0].message?.content?.trim() || '';
}

async function tweetPersona(text: string, token: string) {
  const twitter = new TwitterApi(token);
  await twitter.v2.tweet(text);
}

async function main() {
  const userId = process.env.PERSONA_USER_ID;
  const twitterToken = process.env.TWITTER_ACCESS_TOKEN;

  if (!userId || !twitterToken) {
    console.error('Missing PERSONA_USER_ID or TWITTER_ACCESS_TOKEN');
    process.exit(1);
  }

  const persona = await createPersona(userId);
  console.log('Generated persona:', persona);
  await tweetPersona(persona, twitterToken);
  console.log('Persona tweeted successfully');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
