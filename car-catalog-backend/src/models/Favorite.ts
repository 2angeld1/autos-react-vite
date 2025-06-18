import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFavorite {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  carId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFavoriteDocument extends Omit<IFavorite, '_id'>, Document {}

const FavoriteSchema = new Schema<IFavoriteDocument>({
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure unique user-car combinations
FavoriteSchema.index({ userId: 1, carId: 1 }, { unique: true });

export default mongoose.model<IFavoriteDocument>('Favorite', FavoriteSchema);