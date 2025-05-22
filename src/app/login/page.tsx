"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <button
        onClick={() => signIn("twitter")}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Sign in with Twitter
      </button>
    </div>
  );
}
