'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Bookmark {
  id: string;
  content: string;
  authorUsername: string;
}

interface UserProfile {
  interests: string[];
  suggestedTags: string[];
  roast: string;
}

interface InsightsData {
  actionItems: string[];
  insights: string[];
  userProfile: UserProfile;
}

export default function InsightsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
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

    if (session) {
      fetchBookmarks();
    }
  }, [session]);
  
  const toggleBookmark = (id: string) => {
    setSelectedBookmarks(prev => 
      prev.includes(id) 
        ? prev.filter(bookmarkId => bookmarkId !== id)
        : [...prev, id]
    );
  };
  
  const generateInsights = async () => {
    if (selectedBookmarks.length === 0) {
      setError('Please select at least one bookmark');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/action-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookmarkIds: selectedBookmarks,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setInsights(data);
      } else {
        setError(data.error || 'Failed to generate insights');
      }
    } catch (err) {
      setError('Failed to generate insights');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === 'loading') {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Insights & Action Items</h1>
      <p className="text-gray-600 mb-6">
        Generate personalized insights and action items from your bookmarks
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!insights ? (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Select Bookmarks</h2>
            <p className="text-gray-500 mb-4">
              Choose the bookmarks you want to analyze
              ({selectedBookmarks.length} selected)
            </p>
            
            {bookmarks.length === 0 ? (
              <p className="text-gray-500">No bookmarks found</p>
            ) : (
              <div className="border rounded divide-y max-h-96 overflow-y-auto mb-4">
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
            
            <button
              onClick={generateInsights}
              disabled={isLoading || selectedBookmarks.length === 0}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Insights'}
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Action Items</h2>
            <ul className="list-disc pl-5 space-y-2">
              {insights.actionItems.map((item, index) => (
                <li key={index} className="pl-2">{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-4">Insights</h2>
            <ul className="list-disc pl-5 space-y-2">
              {insights.insights.map((insight, index) => (
                <li key={index} className="pl-2">{insight}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-medium mb-4">Your Profile</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {insights.userProfile.interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Suggested Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {insights.userProfile.suggestedTags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">The Roast 🔥</h3>
                <p className="italic">{insights.userProfile.roast}</p>
              </div>
            </div>
          </div>
          
          <div>
            <button
              onClick={() => setInsights(null)}
              className="bg-gray-100 px-4 py-2 rounded"
            >
              Select Different Bookmarks
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 