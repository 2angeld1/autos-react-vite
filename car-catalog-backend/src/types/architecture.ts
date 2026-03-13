/**
 * ARCHITECTURE TYPES — Categorías y Utilidades
 */

export enum ProjectCategory {
    RESIDENTIAL = 'residencial',
    COMMERCIAL = 'comercial',
    INDUSTRIAL = 'industrial',
    INSTITUTIONAL = 'institucional',
    MIXED = 'mixto'
}

export interface ArchitectureCategoryOption {
    value: string;
    label: string;
    icon: string;
}

export const getAllArchitectureCategories = (): ArchitectureCategoryOption[] => {
    return [
        { value: ProjectCategory.RESIDENTIAL, label: 'Residencial', icon: '🏠' },
        { value: ProjectCategory.COMMERCIAL, label: 'Comercial', icon: '🏢' },
        { value: ProjectCategory.INDUSTRIAL, label: 'Industrial', icon: '🏭' },
        { value: ProjectCategory.INSTITUTIONAL, label: 'Institucional', icon: '🏛️' },
        { value: ProjectCategory.MIXED, label: 'Uso Mixto', icon: '🏙️' }
    ];
};

export const isValidProjectCategory = (category: string): boolean => {
    return Object.values(ProjectCategory).includes(category as ProjectCategory);
};
