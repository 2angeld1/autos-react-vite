/**
 * LUXJEWEL MODULE TYPES
 * Categorías y helpers para el módulo de Alta Joyería
 */

export enum JewelryCategory {
    RINGS = 'rings',
    NECKLACES = 'necklaces',
    BRACELETS = 'bracelets',
    EARRINGS = 'earrings',
    WATCHES = 'watches',
    ENGAGEMENT = 'engagement',
    SETS = 'sets',
}

export interface JewelryCategoryOption {
    id: string;
    name: string;
    slug: string;
    value: string;
    label: string;
    icon: string;
}

const CATEGORY_META: Record<JewelryCategory, { label: string; icon: string }> = {
    [JewelryCategory.RINGS]: { label: 'Anillos', icon: '💍' },
    [JewelryCategory.NECKLACES]: { label: 'Collares', icon: '📿' },
    [JewelryCategory.BRACELETS]: { label: 'Pulseras', icon: '✨' },
    [JewelryCategory.EARRINGS]: { label: 'Aretes', icon: '💎' },
    [JewelryCategory.WATCHES]: { label: 'Relojes', icon: '⌚' },
    [JewelryCategory.ENGAGEMENT]: { label: 'Compromiso', icon: '💍' },
    [JewelryCategory.SETS]: { label: 'Sets', icon: '🎁' },
};

export const getAllJewelryCategories = (): JewelryCategoryOption[] => {
    return Object.entries(JewelryCategory).map(([, value]) => ({
        id: value,
        name: CATEGORY_META[value as JewelryCategory].label,
        slug: value,
        value,
        label: CATEGORY_META[value as JewelryCategory].label,
        icon: CATEGORY_META[value as JewelryCategory].icon,
    }));
};

export const isValidJewelryCategory = (category: string): boolean => {
    return Object.values(JewelryCategory).includes(category as JewelryCategory);
};
