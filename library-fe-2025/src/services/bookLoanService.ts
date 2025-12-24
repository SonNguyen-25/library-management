import bookLoansData, {type BookLoan } from '../data/bookLoans';
import finesData, {type Fine } from '../data/fines';
import bookRequestsData, {type BookRequest, BookRequestStatusEnum, BookRequestTypeEnum } from '../data/bookRequests'; // Import data request

const LOAN_STORAGE_KEY = 'library_book_loans';
const FINE_STORAGE_KEY = 'library_fines';
const REQUEST_STORAGE_KEY = 'library_book_requests';

// Helper lấy data
const getStoredLoans = (): BookLoan[] => {
    const stored = localStorage.getItem(LOAN_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(LOAN_STORAGE_KEY, JSON.stringify(bookLoansData));
    return bookLoansData;
};

export const BookLoanService = {
    getAll: async (): Promise<BookLoan[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return getStoredLoans();
    },

    getByUser: async (username: string): Promise<BookLoan[]> => {
        const loans = getStoredLoans();
        return loans.filter(l => l.userUserName === username);
    },

    create: async (loanData: {
        userUserName: string,
        bookCopyId: number,
        bookCopyOriginalBookTitle: string
    }): Promise<BookLoan> => {
        const loans = getStoredLoans();
        const now = new Date();
        const dueDate = new Date();
        dueDate.setDate(now.getDate() + 14);

        const newLoan: BookLoan = {
            id: `loan-${Date.now()}`,
            bookCopyId: loanData.bookCopyId,
            bookCopyOriginalBookTitle: loanData.bookCopyOriginalBookTitle,
            userUserName: loanData.userUserName,
            loanDate: now.toISOString(),
            dueDate: dueDate.toISOString(),
            returnDate: null,
            status: "BORROWED",
            loanedAt: now.toISOString(),
            updatedAt: now.toISOString()
        };

        const updatedLoans = [newLoan, ...loans];
        localStorage.setItem(LOAN_STORAGE_KEY, JSON.stringify(updatedLoans));
        return newLoan;
    },

    returnBook: async (loanId: string): Promise<void> => {
        const loans = getStoredLoans();
        const index = loans.findIndex(l => l.id === loanId);
        if (index === -1) throw new Error("Loan not found");

        const loan = loans[index];
        const now = new Date();

        loan.status = "RETURNED";
        loan.returnDate = now.toISOString();
        loan.updatedAt = now.toISOString();

        // Lưu Loan
        localStorage.setItem(LOAN_STORAGE_KEY, JSON.stringify(loans));


        // TẠO FINE NẾU QUÁ HẠN
        const dueDate = new Date(loan.dueDate);
        if (now > dueDate) {
            const diffTime = Math.abs(now.getTime() - dueDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            // Phạt 5.000đ mỗi ngày quá hạn
            const fineAmount = diffDays * 5000;
            // Lấy danh sách Fine hiện tại
            const storedFines = localStorage.getItem(FINE_STORAGE_KEY);
            let fines: Fine[] = storedFines ? JSON.parse(storedFines) : finesData;

            const newFine: Fine = {
                id: `fine-auto-${Date.now()}`,
                amount: fineAmount,
                description: `Overdue penalty (${diffDays} days late) for "${loan.bookCopyOriginalBookTitle}"`,
                username: loan.userUserName,
                bookLoanId: loan.id,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
            };

            fines = [newFine, ...fines];
            localStorage.setItem(FINE_STORAGE_KEY, JSON.stringify(fines));
            console.log("Auto-fine created:", newFine);
        }


        // CẬP NHẬT REQUEST
        // Tìm xem có request nào đang xin TRẢ (RETURNING) cho loan này mà đang PENDING?
        const storedRequests = localStorage.getItem(REQUEST_STORAGE_KEY);
        let requests: BookRequest[] = storedRequests ? JSON.parse(storedRequests) : bookRequestsData;

        let requestUpdated = false;
        requests = requests.map(req => {
            if (req.bookLoanId === loanId &&
                req.type === BookRequestTypeEnum.RETURNING &&
                req.status === BookRequestStatusEnum.PENDING) {

                requestUpdated = true;
                return {
                    ...req,
                    status: BookRequestStatusEnum.ACCEPTED,
                    updatedAt: now.toISOString()
                };
            }
            return req;
        });

        if (requestUpdated) {
            localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(requests));
            console.log("Auto-updated related request to ACCEPTED");
        }
    }
};