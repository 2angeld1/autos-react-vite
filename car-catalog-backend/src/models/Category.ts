import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  cloudinaryId?: string;
  cloudinaryUrl?: string;
  featured: boolean;
  status: 'active' | 'inactive';
  type: 'car' | 'architecture';
  parentCategory?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  image: {
    type: String
  },
  cloudinaryId: {
    type: String,
    index: true
  },
  cloudinaryUrl: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true
  },
  type: {
    type: String,
    enum: ['car', 'architecture'],
    default: 'car',
    index: true
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ICategory>('Category', CategorySchema);
