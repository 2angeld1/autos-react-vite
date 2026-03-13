/**
 * ARCHITECTURE TYPES — Categorías y Utilidades
 */

export enum ProjectCategory {
    // CATEGORÍA: CASAS
    HOUSE_GARAGE = 'casa-con-garaje',
    HOUSE_NO_GARAGE = 'casa-sin-garaje',
    HOUSE_TERRACE = 'casa-con-terraza',
    HOUSE_DUPLEX = 'casa-duplex',
    HOUSE_SHARED = 'casa-dos-pisos-compartidos',
    
    // CATEGORÍA: MANSIONES
    MANSIONS = 'mansiones-lujo',
    
    // CATEGORÍA: EDIFICIOS
    BUILDING_ADMIN = 'edificio-administrativo',
    BUILDING_PENTHOUSE = 'edificio-penthouses',
    BUILDING_RESIDENTIAL = 'edificio-residencial',
    BUILDING_GROUP = 'conjunto-edificios',
    
    // CATEGORÍA: COMERCIAL / HOSPITALITY
    COMM_HOTEL = 'comercial-hoteles',
    COMM_RESORT = 'comercial-resorts',
    
    // CATEGORÍA: URBANISMO
    URBAN_BARRIADA = 'urbanismo-barriadas',
    URBAN_CONDOMINIUM = 'urbanismo-condominios',
    
    // CATEGORÍA: SERVICIOS
    INTERIOR_DESIGN = 'diseno-interiores',
    CONSULTANCY = 'consultoria-asesoria',
    PLANS_ONLY = 'venta-planos-puros'
}

export interface ArchitectureCategoryOption {
    value: string;
    label: string;
    icon: string;
}

export const getAllArchitectureCategories = (): ArchitectureCategoryOption[] => {
    return [
        // Casas
        { value: ProjectCategory.HOUSE_GARAGE, label: 'Casas con Garaje', icon: 'Home' },
        { value: ProjectCategory.HOUSE_NO_GARAGE, label: 'Casas sin Garaje', icon: 'Home' },
        { value: ProjectCategory.HOUSE_TERRACE, label: 'Casas con Terraza', icon: 'Sun' },
        { value: ProjectCategory.HOUSE_DUPLEX, label: 'Casas Duplex', icon: 'Layers' },
        { value: ProjectCategory.HOUSE_SHARED, label: 'Dos Pisos Compartidos', icon: 'UserPlus' },
        
        // Mansiones
        { value: ProjectCategory.MANSIONS, label: 'Mansiones de Lujo', icon: 'Gem' },
        
        // Edificios
        { value: ProjectCategory.BUILDING_ADMIN, label: 'Edificios Administrativos', icon: 'Building2' },
        { value: ProjectCategory.BUILDING_PENTHOUSE, label: 'Penthouses', icon: 'ArrowUpCircle' },
        { value: ProjectCategory.BUILDING_RESIDENTIAL, label: 'Edificios Residenciales', icon: 'Building' },
        { value: ProjectCategory.BUILDING_GROUP, label: 'Conjunto de Edificios', icon: 'LayoutGrid' },
        
        // Comercial
        { value: ProjectCategory.COMM_HOTEL, label: 'Hoteles', icon: 'Hotel' },
        { value: ProjectCategory.COMM_RESORT, label: 'Resorts de Descanso', icon: 'Palmtree' },
        
        // Urbanismo
        { value: ProjectCategory.URBAN_BARRIADA, label: 'Barriadas (Urbanismo)', icon: 'Map' },
        { value: ProjectCategory.URBAN_CONDOMINIUM, label: 'Condominios Privados', icon: 'ShieldCheck' },
        
        // Otros
        { value: ProjectCategory.INTERIOR_DESIGN, label: 'Diseño de Interiores', icon: 'Lamp' },
        { value: ProjectCategory.CONSULTANCY, label: 'Consultoría / Asesoría', icon: 'MessageSquare' },
        { value: ProjectCategory.PLANS_ONLY, label: 'Venta de Planos', icon: 'FileText' }
    ];
}

export const isValidProjectCategory = (category: string): boolean => {
    return Object.values(ProjectCategory).includes(category as ProjectCategory);
};
