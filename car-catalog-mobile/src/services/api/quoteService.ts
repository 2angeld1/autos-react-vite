import { backendApi } from './backendApi';

export interface QuoteParams {
    carId: string;
    customerName: string;
    email: string;
    phone: string;
    downPayment: number;
    term: number;
}

export const quoteService = {
    requestQuote: async (params: QuoteParams): Promise<{ message: string }> => {
        const response = await backendApi.post('/quotes', params);
        return response.data as { message: string };
    }
};
