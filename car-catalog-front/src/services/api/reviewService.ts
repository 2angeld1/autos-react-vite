import { BACKEND_API_BASE_URL } from './config';
import type { Review } from '@/types';

/**
 * Obtener reseñas para un auto
 */
export const fetchCarReviews = async (carId: string): Promise<Review[]> => {
  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/reviews/${carId}`);
    const json = await response.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

/**
 * Obtener las últimas reseñas globales (para el Home)
 */
export const fetchLatestReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/reviews/latest`);
    const json = await response.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('Error fetching latest reviews:', error);
    return [];
  }
};

/**
 * Enviar una nueva reseña
 */
export const postReview = async (reviewData: {
  carId: string;
  userName: string;
  rating: number;
  comment: string;
  honeypot?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    const json = await response.json();
    return {
      success: json.success,
      message: json.message || (json.success ? 'Reseña enviada' : 'Error al enviar reseña')
    };
  } catch (error) {
    console.error('Error posting review:', error);
    return { success: false, message: 'Error de conexión con el servidor' };
  }
};
