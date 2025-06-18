import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  carId: Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReviewDocument extends Omit<IReview, '_id'>, Document {}

const ReviewSchema = new Schema<IReviewDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure unique user-car review combinations
ReviewSchema.index({ userId: 1, carId: 1 }, { unique: true });
ReviewSchema.index({ carId: 1, isApproved: 1 });

// Virtual populate for user details
ReviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  select: 'name avatar'
});

// Virtual populate for car details
ReviewSchema.virtual('car', {
  ref: 'Car',
  localField: 'carId',
  foreignField: '_id',
  justOne: true,
  select: 'make model year'
});

// Static methods
ReviewSchema.statics.findApprovedByCar = function(carId: string) {
  return this.find({ carId, isApproved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
};

ReviewSchema.statics.getAverageRating = async function(carId: string) {
  const result = await this.aggregate([
    { $match: { carId: new mongoose.Types.ObjectId(carId), isApproved: true } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  return result.length > 0 ? result[0] : { avgRating: 0, count: 0 };
};

export default mongoose.model<IReviewDocument>('Review', ReviewSchema);