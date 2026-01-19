import { api } from './api';

export interface Quote {
    _id: string;
    car: {
        _id: string;
        make: string;
        carModel: string;
        year: number;
        price: number;
        image: string;
    };
    customerName: string;
    email: string;
    phone: string;
    downPayment: number;
    term: number;
    status: 'pending' | 'contacted' | 'negotiating' | 'closed' | 'lost';
    notes?: string;
    createdAt: string;
}

export const quotesService = {
    getQuotes: async (): Promise<Quote[]> => {
        const response = await api.get('/quotes');
        return response.data;
    },

    updateStatus: async (id: string, status: string, notes?: string): Promise<Quote> => {
        const response = await api.patch(`/quotes/${id}`, { status, notes });
        return response.data;
    }
};
