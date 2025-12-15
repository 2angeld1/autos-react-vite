import mongoose, { Schema, Document } from 'mongoose';

// Interface para el archivo/carpeta
export interface IFileItem {
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size?: number;
  path: string;
  parentFolder?: mongoose.Types.ObjectId | null;
  url?: string;
  thumbnail?: string;
  tags?: string[];
  description?: string;
  createdBy?: mongoose.Types.ObjectId;
  isPublic: boolean;
}

// Interface para el documento de MongoDB
export interface IFileItemDocument extends IFileItem, Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fullPath: string;
}

const FileItemSchema = new Schema<IFileItemDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['file', 'folder'],
    index: true
  },
  mimeType: {
    type: String,
    required: function(this: IFileItemDocument) {
      return this.type === 'file';
    },
    index: true
  },
  size: {
    type: Number,
    default: 0
  },
  path: {
    type: String,
    required: true,
    index: true
  },
  parentFolder: {
    type: Schema.Types.ObjectId,
    ref: 'FileItem',
    default: null,
    index: true
  },
  url: {
    type: String,
    required: function(this: IFileItemDocument) {
      return this.type === 'file';
    }
  },
  thumbnail: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    maxlength: 500
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(_doc, ret) {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(_doc, ret) {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Índices compuestos para búsqueda eficiente
FileItemSchema.index({ parentFolder: 1, name: 1 });
FileItemSchema.index({ type: 1, mimeType: 1 });
FileItemSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual para obtener la ruta completa
FileItemSchema.virtual('fullPath').get(function(this: IFileItemDocument) {
  return this.path;
});

// Virtual para verificar si es imagen
FileItemSchema.virtual('isImage').get(function(this: IFileItemDocument) {
  if (this.type !== 'file' || !this.mimeType) return false;
  return this.mimeType.startsWith('image/');
});

// Virtual para verificar si es PDF
FileItemSchema.virtual('isPdf').get(function(this: IFileItemDocument) {
  if (this.type !== 'file' || !this.mimeType) return false;
  return this.mimeType === 'application/pdf';
});

// Pre-save middleware
FileItemSchema.pre('save', function(next) {
  // Sanitizar el nombre
  this.name = this.name.trim();
  
  // Construir path si no existe
  if (!this.path) {
    this.path = `/${this.name}`;
  }
  
  next();
});

// Nota: La estructura de carpetas se obtiene en el controlador

export default mongoose.model<IFileItemDocument>('FileItem', FileItemSchema);
