// Khớp với BookResponse của be
export interface Book {
    id: number;
    title: string;
    description: string;
    coverUrl: string;
    rating: number;
    publisherName: string;
    authors: string[];
    categories: string[];
    available: boolean;
}

// Khớp với PageResponse của be
export interface PageResponse<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    data: T[];
}