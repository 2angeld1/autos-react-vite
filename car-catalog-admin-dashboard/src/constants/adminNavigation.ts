import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  Mountain, 
  Gem, 
  Sofa, 
  Compass, 
  Building2, 
  FileText, 
  Percent, 
  Image, 
  Tag, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { NavSection } from '@/types/navigation';
import { TFunction } from 'i18next';

export const getAdminNavigation = (t: TFunction): NavSection[] => [
  {
    items: [
      { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    titleKey: 'nav.inventory',
    items: [
      { name: t('nav.cars'), href: '/cars', icon: Car },
      { name: t('nav.accessories'), href: '/accessories', icon: Wrench, badge: 'New' },
      { name: 'IronTrail', href: '/irontrail', icon: Mountain, badge: '4x4' },
      { name: 'LuxJewel', href: '/jewelry', icon: Gem, badge: '💎' },
      { name: 'DecoHaus', href: '/furniture', icon: Sofa, badge: '🛋️' },
      { name: t('nav.architecture'), href: '/architecture', icon: Compass },
      { name: t('nav.brands'), href: '/brands', icon: Building2 },
    ],
  },
  {
    titleKey: 'nav.sales',
    items: [
      { name: 'Quotes', href: '/quotes', icon: FileText },
      { name: t('nav.promotions'), href: '/promotions', icon: Percent },
    ],
  },
  {
    titleKey: 'nav.content',
    items: [
      { name: t('nav.images'), href: '/images', icon: Image },
      { name: t('nav.categories'), href: '/categories', icon: Tag },
      { name: t('nav.reviews'), href: '/reviews', icon: MessageSquare },
    ],
  },
  {
    titleKey: 'nav.system',
    items: [
      { name: t('nav.users'), href: '/users', icon: Users },
      { name: t('nav.analytics'), href: '/analytics', icon: BarChart3 },
      { name: t('nav.settings'), href: '/settings', icon: Settings },
    ],
  },
];
