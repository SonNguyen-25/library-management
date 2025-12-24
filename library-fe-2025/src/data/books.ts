export interface Book {
    id: number;
    title: string;
    description: string;
    publisherId: number | null;
    authorIds: number[];
    categoryIds: number[];
    coverUrl: string;
    rating?: number;
}

const books: Book[] = [
    {
        id: 1,
        title: "1984",
        description: "A dystopian novel set in a totalitarian regime.",
        publisherId: 1,
        authorIds: [1],
        categoryIds: [1],
        coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg",
        rating: 4.8
    },
    {
        id: 2,
        title: "Harry Potter and the Philosopher's Stone",
        description: "The first book in the Harry Potter series.",
        publisherId: 2,
        authorIds: [2],
        categoryIds: [1],
        coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg",
        rating: 4.9
    },
    {
        id: 3,
        title: "Clean Code",
        description: "A handbook of agile software craftsmanship.",
        publisherId: 3,
        authorIds: [3],
        categoryIds: [4],
        coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg",
        rating: 4.7
    },
    {
        id: 4,
        title: "A Brief History of Time",
        description: "A book about modern physics for non-scientists.",
        publisherId: 4,
        authorIds: [4],
        categoryIds: [2],
        coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333578746i/3869.jpg",
        rating: 4.5
    }
];

export default books;