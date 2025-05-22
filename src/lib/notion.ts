import type { Digest, DigestItem, Bookmark } from '@prisma/client';

interface DigestWithBookmarks extends Digest {
  items: (DigestItem & { bookmark: Bookmark })[];
}

export async function exportDigestToNotion(
  digest: DigestWithBookmarks,
  apiKey: string,
  databaseId: string,
) {
  const children = digest.items.map((item) => ({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: { content: item.bookmark.content },
        },
      ],
    },
  }));

  const body = {
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: digest.name } }],
      },
      Description: {
        rich_text: [
          {
            type: 'text',
            text: { content: digest.description || '' },
          },
        ],
      },
    },
    children,
  };

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Notion API responded with ${response.status}`);
  }

  return response.json();
}
