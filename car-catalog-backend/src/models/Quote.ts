import mongoose, { Schema, Document } from 'mongoose';

export interface IQuote extends Document {
  car: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  phone: string;
  downPayment: number;
  term: number;
  status: 'pending' | 'contacted' | 'negotiating' | 'closed' | 'lost';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema: Schema = new Schema({
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  downPayment: {
    type: Number,
    required: true
  },
  term: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'negotiating', 'closed', 'lost'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IQuote>('Quote', QuoteSchema);
