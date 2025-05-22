"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-red-700 mb-4">Authentication Error</h1>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            There was an error with your authentication:
          </p>
          <div className="bg-red-100 p-3 rounded text-red-800 font-mono text-sm break-all">
            {error || "Unknown error"}
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            Please check that:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Your Twitter Developer app has the correct callback URL: <code className="bg-gray-100 px-1 py-0.5 rounded">http://localhost:3000/api/auth/callback/twitter</code></li>
            <li>Your app has the required permissions (read, bookmark.read)</li>
            <li>If your app is in development mode, your Twitter account is authorized to use it</li>
          </ul>
        </div>
        
        <div className="mt-6">
          <Link 
            href="/login" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
} 