import api from './api';
import { Review } from '@/types/review';

export const reviewService = {
  /**
   * Obtener todas las reseñas
   */
  getAllReviews: async (): Promise<Review[]> => {
    const response = await api.get('/reviews');
    return response.data.data;
  },

  /**
   * Responder a una reseña
   */
  replyToReview: async (id: string, reply: string): Promise<Review> => {
    const response = await api.patch(`/reviews/${id}/reply`, { reply });
    return response.data.data;
  },

  /**
   * Aprobar o desaprobar una reseña
   */
  toggleApproval: async (id: string): Promise<Review> => {
    const response = await api.patch(`/reviews/${id}/toggle-approval`);
    return response.data.data;
  },

  /**
   * Eliminar una reseña
   */
  deleteReview: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  }
};

export default reviewService;
