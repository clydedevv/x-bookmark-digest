// Mock data for testing without a real database

export const mockBookmarks = [
  {
    id: '1',
    tweetId: '1234567890',
    content: 'Just released my new product! Check it out at https://example.com',
    authorName: 'Product Hunt',
    authorUsername: 'ProductHunt',
    authorImage: 'https://pbs.twimg.com/profile_images/1234567890/avatar.jpg',
    url: 'https://twitter.com/ProductHunt/status/1234567890',
    createdAt: new Date(),
    importedAt: new Date(),
    userId: 'user1',
    tags: [
      {
        id: 'tag1',
        tagId: 'tag1',
        bookmarkId: '1',
        tag: {
          id: 'tag1',
          name: 'Product',
          userId: 'user1'
        }
      }
    ]
  },
  {
    id: '2',
    tweetId: '0987654321',
    content: 'Here\'s a great thread on building SaaS businesses 👇 (1/10)',
    authorName: 'SaaS Builder',
    authorUsername: 'saasbuilder',
    authorImage: 'https://pbs.twimg.com/profile_images/0987654321/avatar.jpg',
    url: 'https://twitter.com/saasbuilder/status/0987654321',
    createdAt: new Date(),
    importedAt: new Date(),
    userId: 'user1',
    tags: [
      {
        id: 'tag2',
        tagId: 'tag2',
        bookmarkId: '2',
        tag: {
          id: 'tag2',
          name: 'SaaS',
          userId: 'user1'
        }
      }
    ]
  },
  {
    id: '3',
    tweetId: '5555555555',
    content: 'Finally discovered how to optimize React apps effectively. The key is to understand...',
    authorName: 'React Expert',
    authorUsername: 'reactexpert',
    authorImage: 'https://pbs.twimg.com/profile_images/5555555555/avatar.jpg',
    url: 'https://twitter.com/reactexpert/status/5555555555',
    createdAt: new Date(),
    importedAt: new Date(),
    userId: 'user1',
    tags: [
      {
        id: 'tag3',
        tagId: 'tag3',
        bookmarkId: '3',
        tag: {
          id: 'tag3',
          name: 'React',
          userId: 'user1'
        }
      },
      {
        id: 'tag4',
        tagId: 'tag4',
        bookmarkId: '3',
        tag: {
          id: 'tag4',
          name: 'Performance',
          userId: 'user1'
        }
      }
    ]
  }
];

export const mockDigests = [
  {
    id: '1',
    name: 'Weekly Tech Updates',
    description: 'A collection of the best tech tweets from the week',
    schedule: '0 9 * * 1', // 9am every Monday
    lastSent: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user1',
    items: [
      {
        id: 'item1',
        digestId: '1',
        bookmarkId: '1',
        bookmark: mockBookmarks[0]
      },
      {
        id: 'item2',
        digestId: '1',
        bookmarkId: '2',
        bookmark: mockBookmarks[1]
      }
    ]
  }
];

export const mockUser = {
  id: 'user1',
  name: 'Test User',
  email: 'test@example.com',
  image: 'https://pbs.twimg.com/profile_images/user1/avatar.jpg',
  emailVerified: new Date(),
  twitterId: 'twitter123',
}; 