import { Request, Response } from 'express';
import Notification from '@/models/Notification';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';
import { logger } from '@/utils/logger';

export class NotificationController {
  /**
   * Get all notifications for the current user
   */
  static getNotifications = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string) || 20;
    
    // Admins see all system notifications, users see their own
    const query: any = {};
    if (req.user?.role !== 'admin') {
      query.user = req.user?.id;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({ ...query, read: false });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount
    });
  });

  /**
   * Mark a notification as read
   */
  static markAsRead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  });

  /**
   * Mark all notifications as read
   */
  static markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const query: any = {};
    if (req.user?.role !== 'admin') {
      query.user = req.user?.id;
    }

    await Notification.updateMany(
      { ...query, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  });

  /**
   * Delete a notification
   */
  static deleteNotification = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  });

  /**
   * Helper to create a notification (to be called from other controllers)
   */
  static async create(data: {
    user?: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    category?: 'car' | 'user' | 'booking' | 'system';
    link?: string;
  }) {
    try {
      const notification = new Notification(data);
      await notification.save();
      logger.info(`Notification created: ${data.title}`);
      return notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      return null;
    }
  }
}
