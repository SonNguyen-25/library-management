export interface Subscription {
  id: number;
  title: string;
  userId?: string;
  bookId?: number;
  bookCopyId?: number;
  createdAt?: string;
  bookTitle?: string;
}

const subscriptions: Subscription[] = [
  {
    id: 1,
    title: 'Clean Code',
    userId: '1',
    bookId: 1,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    bookTitle: 'Clean Code',
  },
  {
    id: 2,
    title: 'Design Patterns',
    userId: '1',
    bookCopyId: 5,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    bookTitle: 'Design Patterns',
  },
  {
    id: 3,
    title: 'The Pragmatic Programmer',
    userId: '2',
    bookId: 2,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    bookTitle: 'The Pragmatic Programmer',
  },
];

export default subscriptions;
