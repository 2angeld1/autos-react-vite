import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFavorite {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;

  // Opción 1: Legado (Autos)
  carId?: Types.ObjectId;

  // Opción 2: Futuro (Cualquier cosa)
  productId?: Types.ObjectId;   // Referencia al ID del item
  itemModel?: string;           // 'Car' | 'Product' | 'Apparel' (Dynamic Ref)

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

  // --- LEGACY FIELD ---
  carId: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    index: true
  },

  // --- AGNOSTIC FIELDS ---
  productId: {
    type: Schema.Types.ObjectId,
    refPath: 'itemModel', // Magia de Mongoose: Populate dinámico
    index: true
  },
  itemModel: {
    type: String,
    enum: ['Car', 'Product'],
    default: 'Car'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validación: Debe tener AL MENOS uno (carId o productId)
FavoriteSchema.pre('validate', function (next) {
  if (!this.carId && !this.productId) {
    next(new Error('Favorite must have either carId or productId'));
  } else {
    next();
  }
});

// Compound index modificado para evitar duplicados en ambos casos
FavoriteSchema.index({ userId: 1, carId: 1 }, { unique: true, sparse: true });
FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true, sparse: true });

export default mongoose.model<IFavoriteDocument>('Favorite', FavoriteSchema);