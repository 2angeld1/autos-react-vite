import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  country: string;
  founded?: number;
  logo?: string;
  cloudinaryId?: string;
  cloudinaryUrl?: string;
  website?: string;
  status: 'active' | 'inactive';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  founded: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  logo: {
    type: String
  },
  cloudinaryId: {
    type: String,
    index: true
  },
  cloudinaryUrl: {
    type: String
  },
  website: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IBrand>('Brand', BrandSchema);
