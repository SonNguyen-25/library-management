export type CopyStatus = "AVAILABLE" | "BORROWED" | "LOST";

export interface BookCopy {
    id: number;
    bookId: number; // ID sách gốc
    status: CopyStatus;
    condition: string;
}

const bookCopies: BookCopy[] = [
    { id: 101, bookId: 1, status: "AVAILABLE", condition: "Good" },
    { id: 102, bookId: 1, status: "BORROWED", condition: "New" },

    { id: 201, bookId: 2, status: "BORROWED", condition: "Good" },
    { id: 202, bookId: 2, status: "BORROWED", condition: "Worn" },

    { id: 301, bookId: 3, status: "AVAILABLE", condition: "New" },
    { id: 302, bookId: 3, status: "AVAILABLE", condition: "Good" },
    { id: 303, bookId: 3, status: "AVAILABLE", condition: "Good" },

    { id: 401, bookId: 4, status: "LOST", condition: "Worn" },
    { id: 402, bookId: 4, status: "AVAILABLE", condition: "Good" },
];

export default bookCopies;