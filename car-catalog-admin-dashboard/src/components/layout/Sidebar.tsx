import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Image,
  BarChart3, 
  Settings,
  Shield,
  FileText,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { clsx } from '@/utils/clsx';
import Button from '@/components/common/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Cars',
    href: '/cars',
    icon: Car,
    badge: 'New',
    children: [
      { name: 'All Cars', href: '/cars', icon: Car },
      { name: 'Add Car', href: '/cars/add', icon: Car },
      { name: 'Import CSV', href: '/cars/import', icon: FileText },
    ],
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Images',
    href: '/images',
    icon: Image,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    children: [
      { name: 'General', href: '/settings', icon: Settings },
      { name: 'Security', href: '/settings/security', icon: Shield },
      { name: 'API Keys', href: '/settings/api', icon: Shield },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  const NavItemComponent: React.FC<{ item: NavItem; level?: number }> = ({ 
    item, 
    level = 0 
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.name);
    const paddingLeft = level === 0 ? 'pl-6' : 'pl-12';

    if (hasChildren) {
      return (
        <div>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={clsx(
              'w-full flex items-center justify-between py-2 px-3 mx-3 rounded-md text-sm font-medium transition-colors',
              paddingLeft,
              'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
              {item.badge && (
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <div className="mt-1">
              {item.children?.map((child) => (
                <NavItemComponent key={child.name} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          clsx(
            'flex items-center gap-3 py-2 px-3 mx-3 rounded-md text-sm font-medium transition-colors',
            paddingLeft,
            isActive
              ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          )
        }
        onClick={() => {
          // Close mobile sidebar when navigating
          if (window.innerWidth < 1024) {
            onClose();
          }
        }}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.name}</span>
        {item.badge && (
          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed top-0 left-0 z-50 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:z-30'
        )}
      >
        {/* Logo section */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CA</span>
            </div>
            <span className="ml-3 font-semibold text-gray-900">Car Admin</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
            icon={<X className="h-5 w-5" />}
            aria-label="Close sidebar"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavItemComponent key={item.name} item={item} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="bg-primary-50 rounded-lg p-4">
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