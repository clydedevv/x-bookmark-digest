import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';

interface DigestItem {
  id: string;
  bookmarkId: string;
  bookmark: {
    content: string;
    authorUsername: string;
  };
}

interface Digest {
  id: string;
  name: string;
  description: string;
  schedule: string | null;
  lastSent: string | null;
  items: DigestItem[];
}

export default async function DigestsPage() {
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Digests</h1>
        <Link 
          href="/digests/create" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Digest
        </Link>
      </div>
      
      {digests.length === 0 && (
        <p className="text-center py-10">
          No digests found. Create your first digest to summarize your bookmarks.
        </p>
      )}
      
      <div className="space-y-6">
        {digests.map((digest) => (
          <div key={digest.id} className="border rounded-lg p-6">
            <h2 className="text-xl font-medium mb-2">{digest.name}</h2>
            <p className="text-gray-600 mb-4">{digest.description}</p>
            
            {digest.schedule && (
              <p className="text-sm text-gray-500 mb-4">
                Schedule: {digest.schedule}
              </p>
            )}
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Bookmarks ({digest.items.length})</h3>
              <ul className="space-y-2">
                {digest.items.slice(0, 3).map((item) => (
                  <li key={item.id} className="text-sm">
                    {item.bookmark.content.length > 100
                      ? `${item.bookmark.content.substring(0, 100)}...`
                      : item.bookmark.content}
                    <span className="text-gray-500"> - @{item.bookmark.authorUsername}</span>
                  </li>
                ))}
                {digest.items.length > 3 && (
                  <li className="text-sm text-gray-500">
                    + {digest.items.length - 3} more bookmarks
                  </li>
                )}
              </ul>
            </div>
            
            <div className="mt-6 flex gap-2">
              <Link
                href={`/digests/${digest.id}`}
                className="text-blue-500 text-sm"
              >
                View Details
              </Link>
              <span className="text-gray-300">|</span>
              <button className="text-blue-500 text-sm">
                Generate Digest
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
