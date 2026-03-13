import { 
  Building, 
  Building2, 
  FileText, 
  Gem, 
  Home as HomeIcon, 
  Lamp, 
  LayoutGrid, 
  Layers,
  Map as MapIcon, 
  MessageSquare, 
  Settings 
} from 'lucide-react';
import { NavSection } from '@/types/navigation';
import { TFunction } from 'i18next';

export const getArchitectNavigation = (_t: TFunction): NavSection[] => [
  {
    items: [
      { name: 'Estudio Architect', href: '/architecture', icon: LayoutGrid },
    ],
  },
  {
    title_fixed: 'Ventas y Legal',
    items: [
      { name: 'Venta de Planos', href: '/architecture?category=venta-planos-puros', icon: FileText },
      { name: 'Consultoría', href: '/architecture?category=consultoria-asesoria', icon: MessageSquare },
    ],
  },
  { 
    title_fixed: 'Especialidades',
    items: [
      { name: 'Casas', href: '/architecture?group=houses', icon: HomeIcon },
      { name: 'Mansiones', href: '/architecture?category=mansiones-lujo', icon: Gem },
      { name: 'Edificios', href: '/architecture?group=buildings', icon: Building },
      { name: 'Comercial', href: '/architecture?group=commercial', icon: Building2 },
      { name: 'Urbanismo', href: '/architecture?group=urbanism', icon: MapIcon },
      { name: 'Interiorismo', href: '/architecture?category=diseno-interiores', icon: Lamp },
    ]
  },
  {
    title_fixed: 'Sistema',
    items: [
      { name: 'Categorías', href: '/architecture/categories', icon: Layers },
      { name: 'Ajustes de Perfil', href: '/settings', icon: Settings },
    ],
  },
];
