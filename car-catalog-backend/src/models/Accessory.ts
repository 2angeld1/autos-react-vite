import mongoose, { Schema, Document } from 'mongoose';

export interface IAccessory extends Document {
  name: string;
  category: string; // Could also be an ObjectId to a specific AccessoryCategory if needed
  price: number;
  stock: number;
  compatible: string[]; // e.g., ['Sedan', 'SUV']
  image?: string;
  cloudinaryId?: string;
  cloudinaryUrl?: string;
  status: 'active' | 'out_of_stock' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const AccessorySchema = new Schema<IAccessory>({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
    index: true
  },
  compatible: {
    type: [String],
    default: [],
    index: true
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
  status: {
    type: String,
    enum: ['active', 'out_of_stock', 'inactive'],
    default: 'active',
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IAccessory>('Accessory', AccessorySchema);
