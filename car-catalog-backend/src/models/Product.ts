import mongoose, { Schema, Document } from 'mongoose';

/**
 * PRODUCTO AGNÓSTICO (UNIVERSAL)
 * Este modelo está diseñado para soportar cualquier tipo de inventario:
 * Autos, Joyas, Ropa, Comida, Repuestos, Inmuebles, etc.
 */

export interface IProductVariant {
  sku: string;
  name: string; // Ej: "Rojo / XL"
  price?: number; // Precio especifico de la variante (si difiere del base)
  stock: number;
  attributes: Record<string, any>; // Ej: { color: "red", size: "xl" }
}

export interface IProduct extends Document {
  // --- IDENTIFICACIÓN ---
  name: string;           // Nombre comercial principal
  slug: string;           // URL friendly (ej: toyota-hilux-2024)
  sku: string;            // Código principal de inventario
  
  // --- CLASIFICACIÓN ---
  category: Schema.Types.ObjectId;  // Ref a modelo de Categoría Genérica
  brand?: Schema.Types.ObjectId;    // Ref a modelo de Marca (opcional)
  type: string;           // Tipo de negocio: 'vehicle', 'part', 'jewelry', 'food', 'real_estate'
  tags: string[];         // Etiquetas para busqueda rapida (ej: "offroad", "4x4", "promocion")

  // --- COMERCIAL ---
  price: number;
  comparePrice?: number;  // Precio anterior (para mostrar oferta tachada)
  cost?: number;          // Costo interno (para reportes de ganancia)
  stock: number;          // Stock global
  isAvailable: boolean;

  // --- MEDIA ---
  thumbnail: string;      // Imagen principal
  images: string[];       // Galería completa
  videoUrl?: string;      // URL de video (YouTube/Vimeo)
  model3dUrl?: string;    // URL del modelo GLB/GLTF (Tu "Exodia")

  // --- DETALLES ESPECÍFICOS (La Magia Agnóstica) ---
  // Aquí guardamos la data que cambia según el negocio.
  // Autos: { year: 2024, km: 5000, fuel: "gas" }
  // Joyas: { material: "gold", carat: 18 }
  specs: Record<string, any>; 

  // --- VARIANTES (Opcional) ---
  // Para ropa (tallas), repuestos (lados L/R), etc.
  hasVariants: boolean;
  variants?: IProductVariant[];

  // --- SEO & METADATA ---
  seoTitle?: string;
  seoDescription?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true, index: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  sku: { type: String, unique: true, sparse: true, index: true }, // sparse por si algunos no tienen SKU
  
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
  type: { type: String, required: true, index: true }, // Clave para el filtrado por negocio
  tags: [{ type: String, index: true }],

  price: { type: Number, required: true, min: 0, index: true },
  comparePrice: { type: Number, min: 0 },
  cost: { type: Number, min: 0, select: false }, // Oculto por defecto en queries publicas
  stock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true, index: true },

  thumbnail: { type: String, required: true },
  images: [String],
  videoUrl: String,
  model3dUrl: String,

  // Campo Flexible (Schema-less para máxima adaptabilidad)
  specs: { type: Map, of: Schema.Types.Mixed, default: {} },

  hasVariants: { type: Boolean, default: false },
  variants: [{
    sku: String,
    name: String,
    price: Number,
    stock: Number,
    attributes: { type: Map, of: Schema.Types.Mixed }
  }],

  seoTitle: String,
  seoDescription: String

}, { 
  timestamps: true,
  strict: false // Permite flexibilidad extra si se necesita
});

// Índices Compuestos para Búsquedas Veloces
ProductSchema.index({ type: 1, isAvailable: 1, price: 1 });
ProductSchema.index({ name: 'text', tags: 'text', 'specs.make': 'text' }); // Buscador FullText

export default mongoose.model<IProduct>('Product', ProductSchema);
