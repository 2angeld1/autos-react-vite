/**
 * IRONTRAIL - ENUMS DE CATEGORÍAS
 * Clasificación de productos para el módulo IronTrail (4x4, Off-road)
 */

export enum IronTrailCategory {
    SUSPENSION = 'suspension',
    RESORTES = 'resortes',
    SNORKEL = 'snorkel',
    RESCATE = 'rescate',
    ELEVACION = 'elevacion',
    ILUMINACION = 'iluminacion',
    PROTECCION = 'proteccion',
    ACCESORIOS = 'accesorios', // Categoría general catch-all
}

// Labels para el frontend (español)
export const IronTrailCategoryLabels: Record<IronTrailCategory, string> = {
    [IronTrailCategory.SUSPENSION]: 'Suspensión',
    [IronTrailCategory.RESORTES]: 'Resortes',
    [IronTrailCategory.SNORKEL]: 'Snorkel',
    [IronTrailCategory.RESCATE]: 'Rescate',
    [IronTrailCategory.ELEVACION]: 'Elevación',
    [IronTrailCategory.ILUMINACION]: 'Iluminación',
    [IronTrailCategory.PROTECCION]: 'Protección',
    [IronTrailCategory.ACCESORIOS]: 'Accesorios',
};

// Iconos/Emojis sugeridos para el frontend
export const IronTrailCategoryIcons: Record<IronTrailCategory, string> = {
    [IronTrailCategory.SUSPENSION]: '🔧',
    [IronTrailCategory.RESORTES]: '🌀',
    [IronTrailCategory.SNORKEL]: '🌊',
    [IronTrailCategory.RESCATE]: '🪝',
    [IronTrailCategory.ELEVACION]: '⬆️',
    [IronTrailCategory.ILUMINACION]: '💡',
    [IronTrailCategory.PROTECCION]: '🛡️',
    [IronTrailCategory.ACCESORIOS]: '🎒',
};

// Helper para obtener todas las categorías como array (útil para selects)
export const getAllIronTrailCategories = () => {
    return Object.values(IronTrailCategory).map(value => ({
        value,
        label: IronTrailCategoryLabels[value],
        icon: IronTrailCategoryIcons[value],
    }));
};

// Validar si un string es una categoría válida
export const isValidIronTrailCategory = (category: string): category is IronTrailCategory => {
    return Object.values(IronTrailCategory).includes(category as IronTrailCategory);
};
