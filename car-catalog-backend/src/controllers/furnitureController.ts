import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { FurnitureCategory, getAllFurnitureCategories, isValidFurnitureCategory } from '../types/furniture';

/**
 * DECOHAUS CONTROLLER
 * Endpoints para el módulo de Muebles de Diseño
 */

export const getCategories = async (_req: Request, res: Response) => {
    try {
        res.json({ success: true, data: getAllFurnitureCategories() });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener categorías', error: (error as Error).message });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, search, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 12 } = req.query;

        const filter: any = { type: 'furniture', isAvailable: true };

        if (category && isValidFurnitureCategory(category as string)) {
            filter['specs.furnitureCategory'] = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) filter.$text = { $search: String(search) };

        const skip = (Number(page) - 1) * Number(limit);
        const sortOptions: any = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 };

        const [products, total] = await Promise.all([
            Product.find(filter).sort(sortOptions).skip(skip).limit(Number(limit)).populate('category', 'name slug'),
            Product.countDocuments(filter)
        ]);

        res.json({ success: true, data: products, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener muebles', error: (error as Error).message });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, type: 'furniture' }).populate('category', 'name slug');
        if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener mueble', error: (error as Error).message });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, sku, furnitureCategory, price, comparePrice, stock, thumbnail, images, description, material, dimensions, style } = req.body;

        if (furnitureCategory && !isValidFurnitureCategory(furnitureCategory)) {
            return res.status(400).json({ success: false, message: `Categoría inválida. Opciones: ${Object.values(FurnitureCategory).join(', ')}` });
        }

        let defaultCat = await Category.findOne({ name: 'DecoHaus' });
        if (!defaultCat) {
            defaultCat = await Category.create({ name: 'DecoHaus', slug: 'decohaus', description: 'Muebles y Decoración de Diseño', type: 'furniture' });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const product = new Product({
            name, slug, sku,
            type: 'furniture',
            category: defaultCat._id,
            price,
            comparePrice,
            stock: stock || 0,
            isAvailable: true,
            thumbnail,
            images: images || [],
            specs: { furnitureCategory, description, material, dimensions, style }
        });

        await product.save();
        res.status(201).json({ success: true, message: 'Mueble creado exitosamente', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear mueble', error: (error as Error).message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const updates = req.body;
        if (updates.furnitureCategory) {
            updates['specs.furnitureCategory'] = updates.furnitureCategory;
            delete updates.furnitureCategory;
        }

        const product = await Product.findOneAndUpdate({ _id: req.params.id, type: 'furniture' }, updates, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: 'Mueble no encontrado' });
        res.json({ success: true, message: 'Mueble actualizado exitosamente', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar mueble', error: (error as Error).message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, type: 'furniture' });
        if (!product) return res.status(404).json({ success: false, message: 'Mueble no encontrado' });
        res.json({ success: true, message: 'Mueble eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar mueble', error: (error as Error).message });
    }
};
