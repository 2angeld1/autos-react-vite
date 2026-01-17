import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'car' | 'user' | 'booking' | 'system';
  read: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['car', 'user', 'booking', 'system'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  link: {
    type: String
  }
}, {
  timestamps: true
});

// Index for getting unread notifications quickly
NotificationSchema.index({ read: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
