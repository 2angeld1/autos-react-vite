import React, { useState } from 'react';
import { Globe, Save, Clock, Calendar, DollarSign, Layout, Languages } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

const PreferencesSettings: React.FC = () => {
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/dd/yyyy',
    currency: 'USD',
    itemsPerPage: '10',
  });

  const handleChange = (key: keyof typeof preferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const savePreferences = async () => {
    try {
      // Save preferences API call
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="h-10 w-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
          <Globe className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preferences</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customize your regional and display settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Regional Settings */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Regional Settings
          </h4>
          
          <div className="space-y-4">
            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Languages className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={preferences.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2.5 transition-colors"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Timezone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={preferences.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2.5 transition-colors"
                >
                  <option value="America/New_York">Eastern Time (US & Canada)</option>
                  <option value="America/Chicago">Central Time (US & Canada)</option>
                  <option value="America/Denver">Mountain Time (US & Canada)</option>
                  <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Display & Formats
          </h4>
          
          <div className="space-y-4">
            {/* Date Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Date Format
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2.5 transition-colors"
                >
                  <option value="MM/dd/yyyy">MM/dd/yyyy (12/31/2023)</option>
                  <option value="dd/MM/yyyy">dd/MM/yyyy (31/12/2023)</option>
                  <option value="yyyy-MM-dd">yyyy-MM-dd (2023-12-31)</option>
                </select>
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Currency
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={preferences.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2.5 transition-colors"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>

            {/* Items Per Page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Default Items Per Page
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Layout className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={preferences.itemsPerPage}
                  onChange={(e) => handleChange('itemsPerPage', e.target.value)}
                  className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2.5 transition-colors"
                >
                  <option value="10">10 items</option>
                  <option value="20">20 items</option>
                  <option value="50">50 items</option>
                  <option value="100">100 items</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
        <Button onClick={savePreferences} icon={<Save className="h-4 w-4" />}>
          Save Preferences
        </Button>
      </div>
    </Card>
  );
};

export default PreferencesSettings;
