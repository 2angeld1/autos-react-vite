import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { getAllArchitectureCategories, isValidProjectCategory } from '../types/architecture';

/**
 * ARCHITECTURE CONTROLLER
 * Gestión de proyectos arquitectónicos (ProAgnostic)
 */

export const getCategories = async (_req: Request, res: Response) => {
    try {
        res.json({ success: true, data: getAllArchitectureCategories() });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener categorías', error: (error as Error).message });
    }
};

export const getProjects = async (req: Request, res: Response) => {
    try {
        const { category, search, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 12 } = req.query;

        const filter: any = { type: 'architecture', isAvailable: true };

        if (category && isValidProjectCategory(category as string)) {
            filter['specs.projectCategory'] = category;
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
        res.status(500).json({ success: false, message: 'Error al obtener proyectos', error: (error as Error).message });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, type: 'architecture' }).populate('category', 'name slug');
        if (!product) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener proyecto', error: (error as Error).message });
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        const { name, sku, projectCategory, price, comparePrice, stock, thumbnail, images, files, description, area, levels, style, isAvailable } = req.body;

        if (projectCategory && !isValidProjectCategory(projectCategory)) {
            return res.status(400).json({ success: false, message: 'Categoría de arquitectura inválida' });
        }

        let defaultCat = await Category.findOne({ name: 'Architect' });
        if (!defaultCat) {
            defaultCat = await Category.create({ name: 'Architect', slug: 'architect', description: 'Proyectos Arquitectónicos y Planos', type: 'architecture' });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const product = new Product({
            name, slug, sku,
            type: 'architecture',
            category: defaultCat._id,
            price,
            comparePrice,
            stock: stock || 1, // En arquitectura el stock suele ser 1 o ilimitado si es digital
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            thumbnail,
            images: images || [],
            files: files || [],
            specs: { projectCategory, description, area, levels, style }
        });

        await product.save();
        res.status(201).json({ success: true, message: 'Proyecto arquitectónico creado exitosamente', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear proyecto', error: (error as Error).message });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const updates = req.body;
        if (updates.projectCategory) {
            updates['specs.projectCategory'] = updates.projectCategory;
            delete updates.projectCategory;
        }

        const product = await Product.findOneAndUpdate({ _id: req.params.id, type: 'architecture' }, updates, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        res.json({ success: true, message: 'Proyecto actualizado exitosamente', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar proyecto', error: (error as Error).message });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, type: 'architecture' });
        if (!product) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        res.json({ success: true, message: 'Proyecto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar proyecto', error: (error as Error).message });
    }
};
