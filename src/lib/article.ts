import fetch from 'node-fetch';
import unfluff from 'unfluff';

export async function fetchArticleContent(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status}`);
    }
    const html = await res.text();
    const data = unfluff(html);
    return data.text?.trim() || null;
  } catch (err) {
    console.error('Error fetching article content:', err);
    return null;
  }
}
