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

// Virtual populate for user details
FavoriteSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual populate for car details
FavoriteSchema.virtual('car', {
  ref: 'Car',
  localField: 'carId',
  foreignField: '_id',
  justOne: true
});

// Static methods
FavoriteSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId }).populate('car');
};

FavoriteSchema.statics.findByUserAndCar = function(userId: string, carId: string) {
  return this.findOne({ userId, carId });
};

FavoriteSchema.statics.removeByUserAndCar = function(userId: string, carId: string) {
  return this.findOneAndDelete({ userId, carId });
};

export default mongoose.model<IFavoriteDocument>('Favorite', FavoriteSchema);