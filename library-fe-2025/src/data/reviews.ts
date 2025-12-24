export interface Review {
    id: number;
    bookId: number;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

const reviews: Review[] = [
    {
        id: 1,
        bookId: 1,
        userId: "user_01",
        userName: "Alice Nguyen",
        rating: 5,
        comment: "Sách ám ảnh nhưng rất hay, đáng đọc!",
        createdAt: "2024-02-10T10:00:00Z"
    },
    {
        id: 2,
        bookId: 1,
        userId: "user_02",
        userName: "Bob Tran",
        rating: 4,
        comment: "Hơi khó hiểu đoạn đầu.",
        createdAt: "2024-02-12T14:30:00Z"
    },
    {
        id: 3,
        bookId: 2,
        userId: "user_03",
        userName: "Charlie Le",
        rating: 5,
        comment: "Tuổi thơ của tôi! 10/10.",
        createdAt: "2024-01-20T09:15:00Z"
    },
];

export default reviews;