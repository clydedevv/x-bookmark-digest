"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b mb-4 p-4 flex items-center justify-between">
      <nav className="flex gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/bookmarks">Bookmarks</Link>
        <Link href="/digests">Digests</Link>
        <Link href="/settings">Settings</Link>
      </nav>
      {session ? (
        <button onClick={() => signOut()} className="text-sm underline">
          Sign out
        </button>
      ) : null}
    </header>
  );
}
