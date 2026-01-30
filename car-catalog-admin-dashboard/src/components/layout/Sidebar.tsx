import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  Image,
  BarChart3,
  Settings,
  X,
  Wrench,
  Tag,
  FileText,
  Percent,
  Building2,
  Zap,
  Mountain
} from 'lucide-react';
import { clsx } from '@/utils/clsx';
import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  titleKey?: string;
  items: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const navigationSections: NavSection[] = [
    {
      items: [
        {
          name: t('nav.dashboard'),
          href: '/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      titleKey: 'nav.inventory',
      items: [
        {
          name: t('nav.cars'),
          href: '/cars',
          icon: Car,
        },
        {
          name: t('nav.accessories'),
          href: '/accessories',
          icon: Wrench,
          badge: 'New',
        },
        {
          name: 'IronTrail',
          href: '/irontrail',
          icon: Mountain,
          badge: '4x4',
        },
        {
          name: t('nav.brands'),
          href: '/brands',
          icon: Building2,
        },
      ],
    },
    {
      titleKey: 'nav.sales',
      items: [
        {
          name: 'Quotes',
          href: '/quotes',
          icon: FileText,
        },
        {
          name: t('nav.promotions'),
          href: '/promotions',
          icon: Percent,
        },
      ],
    },
    {
      titleKey: 'nav.content',
      items: [
        {
          name: t('nav.images'),
          href: '/images',
          icon: Image,
        },
        {
          name: t('nav.categories'),
          href: '/categories',
          icon: Tag,
        },
      ],
    },
    {
      titleKey: 'nav.system',
      items: [
        {
          name: t('nav.users'),
          href: '/users',
          icon: Users,
        },
        {
          name: t('nav.analytics'),
          href: '/analytics',
          icon: BarChart3,
        },
        {
          name: t('nav.settings'),
          href: '/settings',
          icon: Settings,
        },
      ],
    },
  ];
  const NavItemComponent: React.FC<{ item: NavItem }> = ({ item }) => {
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          clsx(
            'flex items-center gap-3 py-2.5 px-3 mx-3 rounded-lg text-sm font-medium transition-all duration-200',
            isActive
              ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-200 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          )
        }
        onClick={onClose}
      >
        <item.icon className="h-5 w-5" />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out',
          'w-64 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo section */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white fill-current" />
            </div>
            <span className="ml-3 font-bold text-xl tracking-tight text-gray-900 dark:text-white">Velo<span className="text-orange-600">Drive</span></span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon={<X className="h-5 w-5" />}
            aria-label="Close sidebar"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navigationSections.map((section, index) => (
            <div key={index} className="mb-4">
              {section.titleKey && (
                <h3 className="px-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {t(section.titleKey)}
                </h3>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItemComponent key={item.name} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg p-4">
            <p className="text-xs text-orange-800 dark:text-orange-300 font-medium">
              VeloDrive Admin v1.1.0
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Premium Vehicle Management
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;