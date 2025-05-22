import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/login" className="underline text-blue-600">
        Go to Login
      </Link>
    </div>
  );
}
