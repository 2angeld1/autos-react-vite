import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { clsx } from '@/utils/clsx';
import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authSlice';
import { NavItem } from '@/types/navigation';
import { getAdminNavigation } from '@/constants/adminNavigation';
import { getArchitectNavigation } from '@/constants/architectNavigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const userRole = user?.role || 'user';

  const navigationSections = userRole === 'architect' 
    ? getArchitectNavigation(t) 
    : getAdminNavigation(t);

  const NavItemComponent: React.FC<{ item: NavItem; isArchitecture?: boolean }> = ({ item, isArchitecture }) => {
    const location = useLocation();
    const [isOpenChild, setIsOpenChild] = React.useState(false);
    const hasChildren = item.children && item.children.length > 0;

    const currentPath = location.pathname + location.search;
    const isLinkActive = item.href === '#' ? false : currentPath === item.href;

    if (hasChildren) {
      return (
        <div className="space-y-1">
          <button
            onClick={() => setIsOpenChild(!isOpenChild)}
            className={clsx(
              'w-full flex items-center justify-between py-2.5 px-3 mx-3 rounded-lg text-sm font-medium transition-all duration-200 group',
              'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
              isArchitecture && "text-sky-600"
            )}
            style={{ width: 'calc(100% - 1.5rem)' }}
          >
            <div className="flex items-center gap-3">
              <item.icon className={clsx("h-5 w-5", isArchitecture && "text-sky-600")} />
              <span>{item.name}</span>
            </div>
            {isOpenChild ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {isOpenChild && (
            <div className="ml-10 space-y-1 mr-3">
              {item.children?.map((child) => (
                <NavLink
                  key={child.name}
                  to={child.href}
                  className={() => {
                    const childActive = location.pathname + location.search === child.href;
                    return clsx(
                      'flex items-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200',
                      childActive
                        ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-800 dark:text-sky-100'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white'
                    );
                  }}
                  onClick={onClose}
                >
                  <child.icon className="h-4 w-4 opacity-70" />
                  {child.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <NavLink
        to={item.href}
        className={() =>
          clsx(
            'flex items-center gap-3 py-2.5 px-3 mx-3 rounded-lg text-sm font-medium transition-all duration-200',
            isLinkActive
              ? (isArchitecture 
                  ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-900 dark:text-sky-200 shadow-sm border-l-4 border-sky-600' 
                  : 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-200 shadow-sm')
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          )
        }
        onClick={onClose}
      >
        <item.icon className={clsx("h-5 w-5", isArchitecture && "text-sky-600")} />
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
            <div className={clsx(
              "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:rotate-3 relative overflow-hidden",
              userRole === 'architect' 
                ? "bg-sky-600" 
                : "bg-gradient-to-tr from-indigo-600 to-violet-600"
            )}>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              {userRole === 'architect' ? (
                <svg 
                  viewBox="0 0 24 24" 
                  className="h-6 w-6 text-white relative z-10"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              ) : (
                <svg 
                  viewBox="0 0 24 24" 
                  className="h-6 w-6 text-white relative z-10"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                  <path d="M12 12l8-4.5" />
                  <path d="M12 12v9" />
                  <path d="M12 12L4 7.5" />
                </svg>
              )}
            </div>
            <span className="ml-3 font-black text-xl tracking-tighter text-gray-900 dark:text-white uppercase">
              {userRole === 'architect' ? 'Architect' : 'Nexus'}<span className="text-indigo-600">.</span>
            </span>
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
          {navigationSections.map((section, index) => {
            // Filtrar items de la sección según el rol
            const filteredItems = section.items.filter(item => 
              !item.allowedRoles || item.allowedRoles.includes(userRole)
            );

            // Si no hay ítems permitidos en esta sección, no la mostramos
            if (filteredItems.length === 0) return null;

            const isArchSection = userRole === 'architect' || section.titleKey === 'Architecture Hub';
            const displayTitle = section.title_fixed || (section.titleKey ? t(section.titleKey) : null);

            return (
              <div key={index} className={clsx("mb-4", isArchSection && index !== 0 && "mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50")}>
                {displayTitle && (
                  <h3 className={clsx(
                    "px-6 mb-2 text-xs font-semibold uppercase tracking-wider",
                    isArchSection ? "text-sky-600 dark:text-sky-400" : "text-gray-400 dark:text-gray-500"
                  )}>
                    {displayTitle}
                  </h3>
                )}
                <div className="space-y-0.5">
                  {filteredItems.map((item) => (
                    <NavItemComponent key={item.name} item={item} isArchitecture={isArchSection} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg p-4">
            <p className="text-xs text-indigo-800 dark:text-indigo-300 font-bold uppercase tracking-widest">
              Nexus CRM v2.0
            </p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium italic">
              Empowering your architecture
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;