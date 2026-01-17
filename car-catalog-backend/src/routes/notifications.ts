import { Router } from 'express';
import { NotificationController } from '@/controllers/notificationController';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// Apply auth middleware to all notification routes
router.use(authenticateToken);

/**
 * @route   GET /api/notifications
 * @desc    Get current user's notifications
 * @access  Private
 */
router.get('/', NotificationController.getNotifications);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.patch('/:id/read', NotificationController.markAsRead);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.patch('/read-all', NotificationController.markAllAsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', NotificationController.deleteNotification);

export default router;
