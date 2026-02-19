import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { JewelryCategory, getAllJewelryCategories, isValidJewelryCategory } from '../types/jewelry';

/**
 * LUXJEWEL CONTROLLER
 * Endpoints para el módulo de Alta Joyería
 */

export const getCategories = async (_req: Request, res: Response) => {
    try {
        res.json({ success: true, data: getAllJewelryCategories() });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener categorías', error: (error as Error).message });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, search, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 12 } = req.query;

        const filter: any = { type: 'jewelry', isAvailable: true };

        if (category && isValidJewelryCategory(category as string)) {
            filter['specs.jewelryCategory'] = category;
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
        res.status(500).json({ success: false, message: 'Error al obtener joyas', error: (error as Error).message });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, type: 'jewelry' }).populate('category', 'name slug');
        if (!product) return res.status(404).json({ success: false, message: 'Joya no encontrada' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener joya', error: (error as Error).message });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, sku, jewelryCategory, price, comparePrice, stock, thumbnail, images, description, material, carats } = req.body;

        if (jewelryCategory && !isValidJewelryCategory(jewelryCategory)) {
            return res.status(400).json({ success: false, message: `Categoría inválida. Opciones: ${Object.values(JewelryCategory).join(', ')}` });
        }

        let defaultCat = await Category.findOne({ name: 'LuxJewel' });
        if (!defaultCat) {
            defaultCat = await Category.create({ name: 'LuxJewel', slug: 'luxjewel', description: 'Alta Joyería y Relojería', type: 'luxury' });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const product = new Product({
            name, slug, sku,
            type: 'jewelry',
            category: defaultCat._id,
            price,
            comparePrice,
            stock: stock || 0,
            isAvailable: true,
            thumbnail,
            images: images || [],
            specs: { jewelryCategory, description, material, carats }
        });

        await product.save();
        res.status(201).json({ success: true, message: 'Joya creada exitosamente', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear joya', error: (error as Error).message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const updates = req.body;
        if (updates.jewelryCategory) {
            updates['specs.jewelryCategory'] = updates.jewelryCategory;
            delete updates.jewelryCategory;
        }

        const product = await Product.findOneAndUpdate({ _id: req.params.id, type: 'jewelry' }, updates, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: 'Joya no encontrada' });
        res.json({ success: true, message: 'Joya actualizada exitosamente', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar joya', error: (error as Error).message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, type: 'jewelry' });
        if (!product) return res.status(404).json({ success: false, message: 'Joya no encontrada' });
        res.json({ success: true, message: 'Joya eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar joya', error: (error as Error).message });
    }
};
