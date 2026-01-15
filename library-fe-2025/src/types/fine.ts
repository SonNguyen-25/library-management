export interface Fine {
    id: number;
    amount: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        username: string;
        name: string;
    };
    bookLoan?: {
        id: number;
        bookCopy: {
            book: {
                title: string;
                coverUrl: string;
            }
        }
    };
}