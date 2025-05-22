'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportBookmarks() {
  const router = useRouter();
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const importBookmarks = async () => {
    setIsImporting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(`Successfully imported ${data.count} bookmarks`);
        // Refresh the bookmarks list
        router.refresh();
      } else {
        setError(data.error || 'Failed to import bookmarks');
      }
    } catch (err) {
      setError('Failed to import bookmarks');
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="mb-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <button
        onClick={importBookmarks}
        disabled={isImporting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isImporting ? 'Importing...' : 'Import Bookmarks'}
      </button>
      <p className="text-sm text-gray-500 mt-2">
        Import your bookmarks from Twitter/X
      </p>
    </div>
  );
} 