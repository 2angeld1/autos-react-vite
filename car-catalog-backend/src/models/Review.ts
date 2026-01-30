import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;

  // Legacy
  carId?: Types.ObjectId;

  // Agnostic
  productId?: Types.ObjectId;
  itemModel?: string;

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

  // --- LEGACY ---
  carId: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    index: true
  },

  // --- AGNOSTIC ---
  productId: {
    type: Schema.Types.ObjectId,
    refPath: 'itemModel',
    index: true
  },
  itemModel: {
    type: String,
    enum: ['Car', 'Product'],
    default: 'Car'
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

// Validación de Integridad
ReviewSchema.pre('validate', function (next) {
  if (!this.carId && !this.productId) {
    next(new Error('Review must target either a Car or a Product'));
  } else {
    next();
  }
});

// Compound index
ReviewSchema.index({ userId: 1, carId: 1 }, { unique: true, sparse: true });
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true, sparse: true });

// Virtuals
ReviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  select: 'name avatar'
});

// Dynamic item population virtual
ReviewSchema.virtual('item', {
  ref: (doc: IReviewDocument) => doc.itemModel || 'Car',
  localField: (doc: IReviewDocument) => doc.productId ? 'productId' : 'carId',
  foreignField: '_id',
  justOne: true
});

// Legacy Virtual (borrar en futuro)
ReviewSchema.virtual('car', {
  ref: 'Car',
  localField: 'carId',
  foreignField: '_id',
  justOne: true,
  select: 'make model year'
});

export default mongoose.model<IReviewDocument>('Review', ReviewSchema);