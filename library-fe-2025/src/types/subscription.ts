export interface Subscription {
    id: number;
    createdAt: string;
    book: {
        id: number;
        title: string;
        coverUrl: string;
        description: string;
        authors: { name: string }[];
    };
}