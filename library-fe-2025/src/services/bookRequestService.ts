import bookRequestsData, {
    type BookRequest,
    BookRequestStatusEnum
} from '../data/bookRequests';

const REQUEST_STORAGE_KEY = 'library_book_requests';

// Helper lấy data từ localStorage
const getStoredRequests = (): BookRequest[] => {
    const stored = localStorage.getItem(REQUEST_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(bookRequestsData));
    return bookRequestsData;
};

const bookRequestService = {
    getAll: async (): Promise<BookRequest[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return getStoredRequests();
    },

    updateStatus: async (id: string, status: BookRequestStatusEnum): Promise<BookRequest> => {
        const requests = getStoredRequests();
        const index = requests.findIndex(r => r.id === id);
        if (index === -1) throw new Error("Request not found");

        const updatedRequest = { ...requests[index], status, updatedAt: new Date().toISOString() };
        requests[index] = updatedRequest;

        localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(requests));
        return updatedRequest;
    },

    create: async (
        requestData: Omit<BookRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
    ): Promise<BookRequest> => {
        const requests = getStoredRequests();
        const newRequest: BookRequest = {
            ...requestData,
            id: `req-${Date.now()}`,
            status: BookRequestStatusEnum.PENDING,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const updatedRequests = [newRequest, ...requests];
        localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(updatedRequests));
        return newRequest;
    }
};

export default bookRequestService;