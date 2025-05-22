'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Bookmark {
  id: string;
  content: string;
  authorUsername: string;
  url: string;
}

export default function CreateDigestPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const res = await fetch('/api/bookmarks');
        const data = await res.json();
        
        if (res.ok) {
          setBookmarks(data.bookmarks || []);
        } else {
          setError('Failed to load bookmarks');
        }
      } catch (err) {
        setError('Failed to load bookmarks');
        console.error(err);
      }
    }

    fetchBookmarks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedBookmarks.length === 0) {
      setError('Please select at least one bookmark');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          schedule: schedule || undefined,
          bookmarkIds: selectedBookmarks,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        router.push('/digests');
      } else {
        setError(data.error || 'Failed to create digest');
      }
    } catch (err) {
      setError('Failed to create digest');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = (id: string) => {
    setSelectedBookmarks(prev => 
      prev.includes(id) 
        ? prev.filter(bookmarkId => bookmarkId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Create Digest</h1>
        <p className="text-gray-600">
          Select bookmarks and create a digest to summarize them
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="Weekly Tech Digest"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows={3}
            placeholder="A weekly summary of tech tweets and insights"
          />
        </div>
        
        <div>
          <label htmlFor="schedule" className="block text-sm font-medium mb-1">
            Schedule (optional)
          </label>
          <select
            id="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">No schedule</option>
            <option value="0 9 * * 1">Weekly on Monday at 9am</option>
            <option value="0 9 * * 5">Weekly on Friday at 9am</option>
            <option value="0 9 1 * *">Monthly on the 1st at 9am</option>
          </select>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">Select Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <p className="text-gray-500">No bookmarks found</p>
          ) : (
            <div className="border rounded divide-y max-h-96 overflow-y-auto">
              {bookmarks.map((bookmark) => (
                <div 
                  key={bookmark.id} 
                  className={`p-4 flex gap-3 cursor-pointer ${
                    selectedBookmarks.includes(bookmark.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleBookmark(bookmark.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedBookmarks.includes(bookmark.id)}
                    onChange={() => {}} // Handled by the div click
                    className="mt-1"
                  />
                  <div>
                    <p>{bookmark.content}</p>
                    <p className="text-sm text-gray-600">@{bookmark.authorUsername}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Selected {selectedBookmarks.length} of {bookmarks.length} bookmarks
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Digest'}
          </button>
          <Link href="/digests" className="px-4 py-2 border rounded">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
} 