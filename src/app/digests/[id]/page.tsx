import { getServerSession } from 'next-auth/next';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import Link from 'next/link';

interface DigestItem {
  id: string;
  bookmarkId: string;
  bookmark: {
    id: string;
    content: string;
    authorUsername: string;
    authorName: string;
    url: string;
  };
}

interface Digest {
  id: string;
  name: string;
  description: string;
  schedule: string | null;
  lastSent: string | null;
  createdAt: string;
  updatedAt: string;
  items: DigestItem[];
}

export default async function DigestPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const cookieStore = cookies();
  const res = await fetch('http://localhost:3000/api/digest', {
    headers: {
      cookie: cookieStore.toString(),
    },
    cache: 'no-store',
  });

  const data = await res.json();
  const digests: Digest[] = data.digests ?? [];
  const digest = digests.find(d => d.id === params.id);

  if (!digest) {
    notFound();
  }

  // Mock summary for testing
  const summary = `
# ${digest.name}

## Key Themes
- Product Launches
- SaaS Business Strategies
- React Performance Optimization

## Notable Insights
- New products are being launched with increasing focus on user experience
- SaaS businesses are focusing on retention metrics over acquisition
- React applications can be significantly optimized through proper state management

## Action Items & Takeaways
- Check out the new product release at example.com
- Review the SaaS thread for business growth strategies
- Implement React optimization techniques in your projects
  `;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <Link href="/digests" className="text-blue-500 mb-2 inline-block">
          ← Back to Digests
        </Link>
        <h1 className="text-2xl font-semibold mb-2">{digest.name}</h1>
        <p className="text-gray-600">{digest.description}</p>
        
        {digest.schedule && (
          <p className="text-sm text-gray-500 mt-2">
            Schedule: {digest.schedule}
          </p>
        )}
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-medium mb-4">Summary</h2>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Bookmarks ({digest.items.length})</h2>
        <div className="border rounded-lg divide-y">
          {digest.items.map((item) => (
            <div key={item.id} className="p-4">
              <a
                href={item.bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                <p className="font-medium mb-1">{item.bookmark.content}</p>
                <p className="text-sm text-gray-600">
                  @{item.bookmark.authorUsername} ({item.bookmark.authorName})
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-3">
        <Link 
          href={`/digests/${digest.id}/edit`} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Edit Digest
        </Link>
        <button className="bg-gray-100 px-4 py-2 rounded">
          Regenerate Summary
        </button>
      </div>
    </div>
  );
} 