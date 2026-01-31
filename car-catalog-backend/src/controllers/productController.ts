import { Request, Response } from 'express';
import Product, { IProduct } from '@/models/Product';
import { asyncHandler } from '@/middleware/errorHandler';

export class ProductController {
  
  /**
   * GET /api/products
   * Endpoint Universal de Búsqueda y Filtrado
   * Soporta filtros dinámicos en 'specs' via query params planos (ej: ?year=2024 -> specs.year=2024)
   */
  static getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      page = 1,
      limit = 20,
      sort = '-createdAt',
      search,
      type, // 'vehicle', 'jewelry', 'autopart'
      category,
      minPrice,
      maxPrice,
      isAvailable = 'true',
      // ... resto de params dinámicos
      ...dynamicFilters
    } = req.query;

    // 1. Construir Query Base
    const query: Record<string, any> = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (isAvailable === 'true') query.isAvailable = true;

    // 2. Filtro de Precio
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 3. Búsqueda de Texto (Full Text Search)
    if (search) {
      query.$text = { $search: String(search) };
    }

    // 4. MAPEO DE FILTROS DINÁMICOS (La Magia Agnóstica)
    // Todo lo que no sea param estándar, asumimos que es una 'spec' del producto
    Object.keys(dynamicFilters).forEach(key => {
      // SEGURIDAD: Evitar inyección de operadores de Mongo (ej. $where, $ne)
      if (key.startsWith('$')) return;

        const value = dynamicFilters[key];
        if (value && key !== 'limit' && key !== 'page') {
          // Buscamos dentro del objeto 'specs' o en la raíz si existe
            
            // Si es un rango numérico (ej: year)
            if (!isNaN(Number(value))) {
                 query[`specs.${key}`] = Number(value);
            } else {
              // SEGURIDAD: Escapar caracteres especiales para evitar ReDoS en la RegExp
              const safeValue = String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              query[`specs.${key}`] = new RegExp(safeValue, 'i');
            }
        }
    });

    // 5. Ejecutar Query con Paginación
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(String(sort))
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name slug')
      .populate('brand', 'name logo');

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products
    });
  });

  /**
   * GET /api/products/:slug
   * Obtener detalle individual
   */
  static getBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    
    const product = await Product.findOne({ slug, isAvailable: true })
      .populate('category')
      .populate('brand');

    if (!product) {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
      return;
    }

    // Recomendaciones simples basadas en la misma categoría/tipo
    const related = await Product.find({
        category: product.category,
        type: product.type,
        _id: { $ne: product._id }
    }).limit(4).select('name price thumbnail slug');

    res.json({
      success: true,
      data: product,
      related
    });
  });

  /**
   * POST /api/products
   * Crear producto (Admin)
   */
  static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // SEGURIDAD: Mass Assignment Protection
    const {
      name, sku, description, price, comparePrice,
      stock, category, brand, type,
      thumbnail, images, specs, isAvailable,
      isFeatured, tags
    } = req.body;

    const safeData = {
      name, sku, description, price, comparePrice,
      stock, category, brand, type,
      thumbnail, images, specs, isAvailable,
      isFeatured, tags
    };

    const product = await Product.create(safeData);
    res.status(201).json({ success: true, data: product });
  });

   /**
   * PATCH /api/products/:id
   * Actualizar
   */
   static update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
     // SEGURIDAD: Mass Assignment Protection
     const {
       name, sku, description, price, comparePrice,
       stock, category, brand, type,
       thumbnail, images, specs, isAvailable,
       isFeatured, tags
     } = req.body;

     // Solo incluimos campos definidos (para permitir updates parciales)
     const updates: any = {};
     if (name !== undefined) updates.name = name;
     if (sku !== undefined) updates.sku = sku;
     if (description !== undefined) updates.description = description;
     if (price !== undefined) updates.price = price;
     if (comparePrice !== undefined) updates.comparePrice = comparePrice;
     if (stock !== undefined) updates.stock = stock;
     if (category !== undefined) updates.category = category;
     if (brand !== undefined) updates.brand = brand;
     if (type !== undefined) updates.type = type;
     if (thumbnail !== undefined) updates.thumbnail = thumbnail;
     if (images !== undefined) updates.images = images;
     if (specs !== undefined) updates.specs = specs;
     if (isAvailable !== undefined) updates.isAvailable = isAvailable;
     if (isFeatured !== undefined) updates.isFeatured = isFeatured;
     if (tags !== undefined) updates.tags = tags;

     const product = await Product.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
    });
    if (!product) {
       res.status(404).json({ success: false, message: 'No encontrado' });
       return;
    }
    res.json({ success: true, data: product });
  });

  /**
   * DELETE /api/products/:id
   */
  static delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        res.status(404).json({ success: false, message: 'No encontrado' });
        return;
     }
     res.json({ success: true, message: 'Producto eliminado' });
  });
}
