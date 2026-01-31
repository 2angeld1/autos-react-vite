import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';

import { 
    IronTrailCategory, 
    getAllIronTrailCategories, 
    isValidIronTrailCategory 
} from '../types/irontrail';

/**
 * IRONTRAIL CONTROLLER
 * Endpoints específicos para el módulo IronTrail (4x4 Off-Road)
 */

// Obtener todas las categorías disponibles (para dropdowns/filtros en frontend)
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = getAllIronTrailCategories();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener categorías',
            error: (error as Error).message 
        });
    }
};

// Obtener productos IronTrail (filtrados por type = 'irontrail')
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { 
            category, 
            search, 
            minPrice, 
            maxPrice, 
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 12 
        } = req.query;

        // Filtro base: Solo productos de tipo irontrail
        const filter: any = { type: 'irontrail', isAvailable: true };

        // Filtrar por categoría si se especifica
        if (category && isValidIronTrailCategory(category as string)) {
            filter['specs.ironCategory'] = category;
        }

        // Filtrar por rango de precio
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Búsqueda por texto (Sanitizada contra NoSQL Injection)
        if (search) {
            const searchString = String(search); // Forzamos conversión a string
            filter.$text = { $search: searchString };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const sortOptions: any = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 };

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit))
                .populate('category', 'name slug')
                .populate('brand', 'name logo'),
            Product.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener productos IronTrail',
            error: (error as Error).message 
        });
    }
};

// Obtener un producto por ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findOne({ 
            _id: id, 
            type: 'irontrail' 
        })
        .populate('category', 'name slug')
        .populate('brand', 'name logo');

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Producto no encontrado' 
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener el producto',
            error: (error as Error).message 
        });
    }
};

// Crear un nuevo producto IronTrail (Admin)
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { 
            name, 
            sku,
            ironCategory, // Nueva categoría específica de IronTrail
            price,
            comparePrice,
            stock,
            thumbnail,
            images,
            description,
            specs,
            brand,
            category
        } = req.body;

        // Validar categoría IronTrail
        if (ironCategory && !isValidIronTrailCategory(ironCategory)) {
            return res.status(400).json({
                success: false,
                message: `Categoría inválida. Opciones válidas: ${Object.values(IronTrailCategory).join(', ')}`
            });
        }

        // --- SOLUCIÓN ERROR 500: Asegurar categoría por defecto ---
        // El modelo Product requiere 'category'. Si no viene, usamos/creamos una genérica "IronTrail"
        let categoryId = category;
        if (!categoryId) {
            let defaultCat = await Category.findOne({ name: 'IronTrail' });
            if (!defaultCat) {
                // Crear categoría genérica si no existe
                defaultCat = await Category.create({
                    name: 'IronTrail',
                    slug: 'irontrail',
                    description: 'Categoría general para productos 4x4 IronTrail',
                    type: 'part' // Tipo compatible
                });
            }
            categoryId = defaultCat._id;
        }
        // -----------------------------------------------------------

        // Generar slug
        const slug = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const product = new Product({
            name,
            slug,
            sku,
            type: 'irontrail', // Siempre será irontrail para este módulo
            category: categoryId, // Usamos la categoría resuelta
            brand,
            price,
            comparePrice,
            stock: stock || 0,
            isAvailable: true,
            thumbnail,
            images: images || [],
            specs: {
                ...specs,
                ironCategory, // Guardamos la categoría IronTrail en specs
                description
            }
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Producto IronTrail creado exitosamente',
            data: product
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear el producto',
            error: (error as Error).message 
        });
    }
};

// Actualizar producto IronTrail (Admin)
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validar categoría IronTrail si se está actualizando
        if (updates.ironCategory && !isValidIronTrailCategory(updates.ironCategory)) {
            return res.status(400).json({
                success: false,
                message: `Categoría inválida. Opciones válidas: ${Object.values(IronTrailCategory).join(', ')}`
            });
        }

        // Si se actualiza ironCategory, moverla a specs
        if (updates.ironCategory) {
            updates['specs.ironCategory'] = updates.ironCategory;
            delete updates.ironCategory;
        }

        const product = await Product.findOneAndUpdate(
            { _id: id, type: 'irontrail' },
            updates,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Producto no encontrado' 
            });
        }

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: product
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar el producto',
            error: (error as Error).message 
        });
    }
};

// Eliminar producto IronTrail (Admin)
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findOneAndDelete({ 
            _id: id, 
            type: 'irontrail' 
        });

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Producto no encontrado' 
            });
        }

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar el producto',
            error: (error as Error).message 
        });
    }
};
