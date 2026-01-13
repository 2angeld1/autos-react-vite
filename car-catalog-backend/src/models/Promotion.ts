import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotion {
  name: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'expired' | 'scheduled' | 'paused';
  applicableTo?: string;
  description?: string;
  image?: string;
  cloudinaryId?: string;
  cloudinaryUrl?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPromotionDocument extends IPromotion, Document {}

const PromotionSchema = new Schema<IPromotionDocument>(
  {
    name: {
      type: String,
      required: [true, 'Promotion name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    code: {
      type: String,
      required: [true, 'Promotion code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, 'Code cannot exceed 20 characters']
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    value: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Value cannot be negative']
    },
    minPurchase: {
      type: Number,
      default: 0,
      min: [0, 'Minimum purchase cannot be negative']
    },
    maxDiscount: {
      type: Number,
      default: null
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    usageLimit: {
      type: Number,
      default: 0 // 0 = unlimited
    },
    usedCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'scheduled', 'paused'],
      default: 'scheduled'
    },
    applicableTo: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    image: {
      type: String,
      trim: true
    },
    cloudinaryId: {
      type: String,
      trim: true
    },
    cloudinaryUrl: {
      type: String,
      trim: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual to check if promotion is currently valid
PromotionSchema.virtual('isValid').get(function() {
  const now = new Date();
  const isDateValid = now >= this.startDate && now <= this.endDate;
  const isUsageValid = this.usageLimit === 0 || this.usedCount < this.usageLimit;
  return this.status === 'active' && isDateValid && isUsageValid;
});

// Virtual for remaining uses
PromotionSchema.virtual('remainingUses').get(function() {
  if (this.usageLimit === 0) return 'Unlimited';
  return Math.max(0, this.usageLimit - this.usedCount);
});

// Pre-save middleware to auto-update status based on dates
PromotionSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.status !== 'paused') {
    if (now < this.startDate) {
      this.status = 'scheduled';
    } else if (now > this.endDate) {
      this.status = 'expired';
    } else if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) {
      this.status = 'expired';
    } else {
      this.status = 'active';
    }
  }
  
  next();
});

// Index for faster queries
PromotionSchema.index({ code: 1 });
PromotionSchema.index({ status: 1 });
PromotionSchema.index({ startDate: 1, endDate: 1 });

const Promotion = mongoose.model<IPromotionDocument>('Promotion', PromotionSchema);

export default Promotion;
