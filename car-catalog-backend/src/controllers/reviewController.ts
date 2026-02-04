import { Request, Response } from 'express';
import Review from '@/models/Review';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';

export class ReviewController {
  /**
   * Obtener todas las reseñas de un auto específico
   */
  static getCarReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { carId } = req.params;
    
    const reviews = await Review.find({ carId, isApproved: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  });

  /**
   * Obtener las últimas reseñas globales (para el Home)
   */
  static getLatestReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('car', 'make carModel year');

    res.status(200).json({
      success: true,
      data: reviews
    });
  });

  /**
   * Crear una nueva reseña
   */
  static createReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { carId, userName, rating, comment, honeypot } = req.body;
    const ip = req.ip || req.header('x-forwarded-for') || '';

    // 1. FILTRO ANTI-SPAM: Honeypot
    // Si el campo oculto tiene algo, es un bot
    if (honeypot) {
      logger.warn(`Spam detectado (honeypot) desde IP: ${ip}`);
      res.status(200).json({ success: true, message: 'Gracias por tu comentario' }); // Engañamos al bot
      return;
    }

    // 2. FILTRO ANTI-SPAM: Rate Limiting por IP
    // Evitar que la misma IP publique más de 1 vez cada 5 minutos para el mismo auto
    const lastReview = await Review.findOne({
      carId,
      ip,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    });

    if (lastReview) {
      res.status(429).json({
        success: false,
        message: 'Has publicado demasiado rápido. Intenta de nuevo en unos minutos.'
      });
      return;
    }

    // 3. Crear reseña
    const review = await Review.create({
      carId,
      userName,
      rating: parseInt(rating),
      comment,
      ip
    });

    logger.info(`Nueva reseña creada para el auto ${carId} por ${userName}`);

    res.status(201).json({
      success: true,
      data: review,
      message: 'Reseña enviada con éxito'
    });
  });

  /**
   * Obtener todas las reseñas (ADMIN)
   */
  static getAllReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('car', 'make carModel year');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  });

  /**
   * Responder a una reseña (ADMIN)
   */
  static replyToReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { reply } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { 
        reply,
        repliedAt: new Date()
      },
      { new: true }
    );

    if (!review) {
      res.status(404).json({ success: false, message: 'Reseña no encontrada' });
      return;
    }

    res.status(200).json({
      success: true,
      data: review,
      message: 'Respuesta guardada'
    });
  });

  /**
   * Alternar estado de aprobación (ADMIN)
   */
  static toggleApproval = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Reseña no encontrada' });
      return;
    }

    review.isApproved = !review.isApproved;
    await review.save();

    res.status(200).json({
      success: true,
      data: review,
      message: `Reseña ${review.isApproved ? 'aprobada' : 'oculta'}`
    });
  });

  /**
   * Eliminar una reseña (ADMIN)
   */
  static deleteReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      res.status(404).json({ success: false, message: 'Reseña no encontrada' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Reseña eliminada correctamente'
    });
  });
}
