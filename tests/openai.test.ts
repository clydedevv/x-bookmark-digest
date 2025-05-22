const createMock = jest.fn();

jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: { create: createMock },
      },
    })),
  };
});

import { generateDigestSummary } from '@/lib/openai';

describe('generateDigestSummary', () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it('returns summary text on success', async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: 'summary text' } }],
    });
    const bookmarks = [
      {
        authorUsername: 'user1',
        authorName: 'User One',
        content: 'tweet content',
        url: 'http://example.com',
      },
    ] as any;

    await expect(generateDigestSummary(bookmarks)).resolves.toBe('summary text');
  });

  it('throws error when openai fails', async () => {
    const error = new Error('API failure');
    createMock.mockRejectedValue(error);
    const bookmarks = [
      {
        authorUsername: 'user1',
        authorName: 'User One',
        content: 'tweet content',
        url: 'http://example.com',
      },
    ] as any;

    await expect(generateDigestSummary(bookmarks)).rejects.toThrow('API failure');
  });
});
