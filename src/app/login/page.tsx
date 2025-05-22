'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <button
        onClick={() => signIn('twitter')}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Sign in with Twitter
      </button>
    </div>
  );
}
