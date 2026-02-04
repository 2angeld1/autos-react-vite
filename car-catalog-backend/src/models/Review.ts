import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview {
  _id?: Types.ObjectId;
  userId?: Types.ObjectId; // AHORA ES OPCIONAL (para usuarios logueados)
  userName?: string;       // PARA USUARIOS NO LOGUEADOS

  carId: string;           // Referencia al ID del auto (String para match con el id de nuestro sistema)

  rating: number;      // 1 a 5 estrellas
  comment: string;     // El texto de la opinión
  reply?: string;      // Respuesta del admin
  repliedAt?: Date;    // Fecha de la respuesta
  isApproved: boolean;
  ip?: string;          // Para control de spam
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReviewDocument extends Omit<IReview, '_id'>, Document {}

const ReviewSchema = new Schema<IReviewDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Permitimos reseñas anónimas
    index: true
  },
  userName: {
    type: String,
    required: function (this: any) { return !this.userId; }, // Requerido si no hay userId
    trim: true,
    maxlength: 50
  },
  carId: {
    type: String,
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
  reply: {
    type: String,
    trim: true,
    maxlength: 500
  },
  repliedAt: {
    type: Date
  },
  isApproved: {
    type: Boolean,
    default: true, // Por ahora las aprobamos al instante
    index: true
  },
  ip: {
    type: String,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para obtener info del auto
ReviewSchema.virtual('car', {
  ref: 'Car',
  localField: 'carId',
  foreignField: 'id',
  justOne: true
});

// Evitar spam masivo de la misma IP para el mismo auto
ReviewSchema.index({ carId: 1, ip: 1 });

export default mongoose.model<IReviewDocument>('Review', ReviewSchema);