import mongoose, { Schema, Document } from 'mongoose';
import { ICar } from '@/types/car';

export interface ICarDocument extends Omit<ICar, '_id'>, Document {}

const CarSchema = new Schema<ICarDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  make: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  model: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 2,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  fuel_type: {
    type: String,
    required: true,
    enum: ['gas', 'diesel', 'electricity', 'hybrid'],
    index: true
  },
  transmission: {
    type: String,
    required: true,
    enum: ['a', 'm'], // automatic, manual
    index: true
  },
  cylinders: {
    type: Number,
    required: true,
    min: 1,
    max: 16
  },
  class: {
    type: String,
    required: true,
    index: true
  },
  displacement: {
    type: Number,
    required: true,
    min: 0.5,
    max: 10.0
  },
  city_mpg: {
    type: Number,
    required: true,
    min: 1,
    max: 200
  },
  highway_mpg: {
    type: Number,
    required: true,
    min: 1,
    max: 200
  },
  combination_mpg: {
    type: Number,
    required: true,
    min: 1,
    max: 200
  },
  features: [{
    type: String,
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for search performance
CarSchema.index({ make: 1, model: 1, year: 1 });
CarSchema.index({ price: 1, year: 1 });
CarSchema.index({ class: 1, fuel_type: 1 });
CarSchema.index({ 
  make: 'text', 
  model: 'text', 
  description: 'text' 
}, {
  weights: {
    make: 10,
    model: 8,
    description: 1
  }
});

// Virtual for full name
CarSchema.virtual('fullName').get(function(this: ICarDocument) {
  return `${this.make} ${this.model} ${this.year}`;
});

// Virtual for fuel efficiency
CarSchema.virtual('avgMpg').get(function(this: ICarDocument) {
  return Math.round((this.city_mpg + this.highway_mpg) / 2);
});

// Pre-save middleware
CarSchema.pre('save', function(this: ICarDocument, next) {
  if (this.isModified('make')) {
    this.make = this.make.charAt(0).toUpperCase() + this.make.slice(1).toLowerCase();
  }
  if (this.isModified('model')) {
    this.model = this.model.charAt(0).toUpperCase() + this.model.slice(1).toLowerCase();
  }
  next();
});

// Static methods
CarSchema.statics.findByMake = function(make: string) {
  return this.find({ make: new RegExp(make, 'i'), isAvailable: true });
};

CarSchema.statics.findInPriceRange = function(minPrice: number, maxPrice: number) {
  return this.find({ 
    price: { $gte: minPrice, $lte: maxPrice },
    isAvailable: true 
  });
};

export default mongoose.model<ICarDocument>('Car', CarSchema);