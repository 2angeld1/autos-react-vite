import api from './config';

export interface QuoteData {
  carId: string | number;
  customerName: string;
  email: string;
  phone: string;
  downPayment: number;
  term: number;
}

export interface QuoteResponse {
  message: string;
  quoteId: string;
}

export const createQuote = async (data: QuoteData): Promise<QuoteResponse> => {
  try {
    const response = await api.post<QuoteResponse>('/quotes', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating quote:', error);
    throw error.response?.data || { message: 'Error al enviar la cotización' };
  }
};
