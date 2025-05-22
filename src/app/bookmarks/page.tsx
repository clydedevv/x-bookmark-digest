import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { authOptions } from '../api/auth/[...nextauth]/route';

interface Bookmark {
  id: string;
  content: string;
  authorUsername: string;
  url: string;
}

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const cookieStore = cookies();
  const res = await fetch('http://localhost:3000/api/bookmarks', {
    headers: {
      cookie: cookieStore.toString(),
    },
    cache: 'no-store',
  });

  const data = await res.json();
  const bookmarks: Bookmark[] = data.bookmarks ?? [];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Bookmarks</h1>
      {bookmarks.length === 0 && <p>No bookmarks found.</p>}
      <ul className="flex flex-col gap-4">
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id} className="border p-4 rounded">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="font-medium mb-1">{bookmark.content}</p>
              <p className="text-sm text-gray-600">@{bookmark.authorUsername}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
