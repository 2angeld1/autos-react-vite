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
        const value = dynamicFilters[key];
        if (value && key !== 'limit' && key !== 'page') {
            // Buscamos dentro del objeto 'specs' o en la raíz si existe
            // Nota: Para ser más precisos, idealmente prefijar en frontend: ?specs_year=2024
            // Pero para UX limpia, intentamos mapear directo:
            
            // Si es un rango numérico (ej: year)
            if (!isNaN(Number(value))) {
                 query[`specs.${key}`] = Number(value);
            } else {
                 // Búsqueda regex insensible a mayúsculas para textos
                 query[`specs.${key}`] = new RegExp(String(value), 'i');
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
    // Aquí podrías agregar validaciones extra según el 'type' si fuera necesario
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  });

   /**
   * PATCH /api/products/:id
   * Actualizar
   */
   static update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
