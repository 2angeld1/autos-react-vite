import React from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="bg-gray-100 shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button and logo */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            icon={<Menu className="h-6 w-6 text-gray-700" />}
            aria-label="Toggle sidebar"
            className="hover:bg-gray-200 transition-colors"
          />
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <span className="ml-2 text-gray-900 font-semibold text-lg hidden sm:block">Car Admin</span>
          </div>
        </div>

        {/* Center - Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Input
              placeholder="Buscar..."
              className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:text-gray-900"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Bell className="h-5 w-5 text-gray-700" />}
            aria-label="Notifications"
            className="hover:bg-gray-200 transition-colors relative"
          >
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<User className="h-5 w-5 text-gray-700" />}
            aria-label="User menu"
            className="hover:bg-gray-200 transition-colors"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;