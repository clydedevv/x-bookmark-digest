import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto py-20 flex flex-col gap-6 text-center">
      <h1 className="text-3xl font-bold">Welcome to X Bookmark Digest</h1>
      <p className="text-lg">
        Sign in with your Twitter account to import and organize your bookmarks.
      </p>
      <div className="flex justify-center">
        <Link
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
