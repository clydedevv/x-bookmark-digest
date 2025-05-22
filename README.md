# X Bookmark Digest

A Twitter/X bookmark management application that helps you organize, tag, and digest your Twitter bookmarks. Features include AI-powered summaries, scheduled digests, and integration with services like Notion.

## Features

- Import Twitter bookmarks
- Auto-organize bookmarks by topic and author
- Create custom reading digests
- AI-powered chat with your bookmarks
- Export digests to Notion
- Schedule digests via X direct messages
- Sync to Notion, Sheets and other platforms
- Filter bookmarks by time to read

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Twitter Developer Account (for API access)
- OpenAI API key

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/bookmark_digest"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
OPENAI_API_KEY="your-openai-api-key"
NOTION_API_KEY="your-notion-api-key"
NOTION_DATABASE_ID="your-notion-database-id"
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run database migrations:

```bash
npx prisma migrate dev
```

4. Start the development server:

```bash
npm run dev
```

5. Visit http://localhost:3000 in your browser

### External Integrations

You can export a digest to Notion using the `/api/integrations/notion` endpoint.
Make sure `NOTION_API_KEY` and `NOTION_DATABASE_ID` are set in your environment.
Send a POST request with the digest ID:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"digestId": "your-digest-id"}' \
  http://localhost:3000/api/integrations/notion
```

## Tech Stack

- Next.js - React framework
- NextAuth.js - Authentication
- Prisma - Database ORM
- Tailwind CSS - Styling
- Twitter API v2 - Bookmark access
- OpenAI API - AI-powered features
- Headless UI - UI components

## Generating Personas

The `scripts/generatePersonas.ts` utility creates a short persona from a
user's latest bookmarks and tweets it automatically. Configure the following
environment variables:

```
OPENAI_API_KEY=your-openai-key
TWITTER_ACCESS_TOKEN=token-with-write-access
PERSONA_USER_ID=your-user-id
```

Then run:

```bash
npx ts-node scripts/generatePersonas.ts
```

The script will analyze the bookmarks, generate a persona description, and post
it to your account.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
