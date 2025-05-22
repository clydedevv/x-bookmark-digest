'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="p-4 border-b flex justify-between items-center">
      <Link href="/" className="font-semibold">X Bookmark Digest</Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link href="/bookmarks">Bookmarks</Link>
            <Link href="/digests">Digests</Link>
            <Link href="/insights">Insights</Link>
            <button onClick={() => signOut()} className="text-sm underline">
              Sign out
            </button>
          </>
        ) : (
          <button onClick={() => signIn('twitter')} className="text-sm underline">
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
} 