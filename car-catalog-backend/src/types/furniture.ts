/**
 * DECOHAUS MODULE TYPES
 * Categorías y helpers para el módulo de Muebles de Diseño
 */

export enum FurnitureCategory {
    LIVING = 'living',
    DINING = 'dining',
    BEDROOM = 'bedroom',
    OFFICE = 'office',
    OUTDOOR = 'outdoor',
    LIGHTING = 'lighting',
    DECOR = 'decor',
}

export interface FurnitureCategoryOption {
    id: string;
    name: string;
    slug: string;
    value: string;
    label: string;
    icon: string;
}

const CATEGORY_META: Record<FurnitureCategory, { label: string; icon: string }> = {
    [FurnitureCategory.LIVING]: { label: 'Sala', icon: '🛋️' },
    [FurnitureCategory.DINING]: { label: 'Comedor', icon: '🍽️' },
    [FurnitureCategory.BEDROOM]: { label: 'Dormitorio', icon: '🛏️' },
    [FurnitureCategory.OFFICE]: { label: 'Oficina', icon: '🖥️' },
    [FurnitureCategory.OUTDOOR]: { label: 'Exterior', icon: '🌿' },
    [FurnitureCategory.LIGHTING]: { label: 'Iluminación', icon: '💡' },
    [FurnitureCategory.DECOR]: { label: 'Decoración', icon: '🎨' },
};

export const getAllFurnitureCategories = (): FurnitureCategoryOption[] => {
    return Object.entries(FurnitureCategory).map(([, value]) => ({
        id: value,
        name: CATEGORY_META[value as FurnitureCategory].label,
        slug: value,
        value,
        label: CATEGORY_META[value as FurnitureCategory].label,
        icon: CATEGORY_META[value as FurnitureCategory].icon,
    }));
};

export const isValidFurnitureCategory = (category: string): boolean => {
    return Object.values(FurnitureCategory).includes(category as FurnitureCategory);
};
