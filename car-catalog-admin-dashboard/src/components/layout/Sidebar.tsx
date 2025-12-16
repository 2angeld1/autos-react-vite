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
  CalendarCheck,
  Percent,
  Building2
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
          name: t('nav.bookings'),
          href: '/bookings',
          icon: CalendarCheck,
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
              ? 'bg-primary-100 text-primary-900 shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
          'fixed top-0 left-0 z-50 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
          'w-64 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo section */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CA</span>
            </div>
            <span className="ml-3 font-semibold text-gray-900">Car Admin</span>
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
                <h3 className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
            <p className="text-xs text-primary-800 font-medium">
              Car Catalog Admin v1.0.0
            </p>
            <p className="text-xs text-primary-600 mt-1">
              Dashboard for car management
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;