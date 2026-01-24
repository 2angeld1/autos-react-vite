import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/common/Card';
import toast from 'react-hot-toast';

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <Palette className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h3>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'light', label: 'Light', icon: '☀️' },
              { key: 'dark', label: 'Dark', icon: '🌙' },
              { key: 'system', label: 'System', icon: '⚙️' },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleThemeChange(option.key as 'light' | 'dark' | 'system')}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  theme === option.key
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-lg mb-1">{option.icon}</div>
                <div className="text-sm font-medium dark:text-gray-200">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Collapsed Sidebar</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Keep sidebar minimized by default</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              sidebarCollapsed ? 'bg-primary-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                sidebarCollapsed ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default AppearanceSettings;
