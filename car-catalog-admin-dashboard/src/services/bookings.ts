export interface Booking {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  car: {
    name: string;
    image: string;
  };
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

// Mock service for now
export const bookingsService = {
  getBookings: async () => {
    // Simulate API call
    return Promise.resolve({ success: true, data: [] });
  }
};
