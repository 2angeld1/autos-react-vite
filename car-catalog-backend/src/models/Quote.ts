import mongoose, { Schema, Document } from 'mongoose';

export interface IQuoteItem {
  product: mongoose.Types.ObjectId;
  itemModel: 'Car' | 'Product';
  quantity: number;
  notes?: string;
}

export interface IQuote extends Document {
  // Legacy (Single Car)
  car?: mongoose.Types.ObjectId;

  // Modern (Multi Item)
  items?: IQuoteItem[];

  customerName: string;
  email: string;
  phone: string;
  downPayment?: number; // Opcional ahora (no aplica a repuestos siempre)
  term?: number;        // Opcional
  message?: string;     // General inquiry message

  status: 'pending' | 'contacted' | 'negotiating' | 'closed' | 'lost';
  source: 'web' | 'mobile' | 'pos'; // Origen de la cotización
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>({
// --- LEGACY ---
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car'
  },

  // --- AGNOSTIC MULTI-ITEM ---
  items: [{
    product: { type: Schema.Types.ObjectId, refPath: 'items.itemModel' },
    itemModel: { type: String, enum: ['Car', 'Product'], default: 'Product' },
    quantity: { type: Number, default: 1 },
    notes: String
  }],

  customerName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },

  downPayment: { type: Number },
  term: { type: Number },
  message: { type: String },

  status: {
    type: String,
    enum: ['pending', 'contacted', 'negotiating', 'closed', 'lost'],
    default: 'pending'
  },
  source: {
    type: String,
    enum: ['web', 'mobile', 'pos'],
    default: 'web'
  }
}, {
  timestamps: true
});

export default mongoose.model<IQuote>('Quote', QuoteSchema);
