import React, { useState } from 'react';
import { Bell, Save } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    carUpdates: true,
      userActivities: false,
      systemAlerts: true,
      weeklyReports: true,
  });

    const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveSettings = async () => {
    try {
      // Save notification settings API call
      toast.success('Notification settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const NotificationToggle = ({ 
    label, 
    description, 
    enabled, 
    onChange 
  }: {
    label: string;
    description: string;
    enabled: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          enabled ? 'bg-primary-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
      </div>

      <div className="space-y-1">
        <NotificationToggle
          label="Email Notifications"
          description="Receive notifications via email"
          enabled={settings.emailNotifications}
          onChange={() => handleToggle('emailNotifications')}
        />
        <NotificationToggle
          label="Push Notifications"
          description="Receive push notifications in browser"
          enabled={settings.pushNotifications}
          onChange={() => handleToggle('pushNotifications')}
        />
        <NotificationToggle
          label="Car Updates"
          description="Get notified when cars are added or updated"
          enabled={settings.carUpdates}
          onChange={() => handleToggle('carUpdates')}
        />
        <NotificationToggle
          label="User Activities"
          description="Get notified about user registrations and activities"
          enabled={settings.userActivities}
          onChange={() => handleToggle('userActivities')}
        />
        <NotificationToggle
          label="System Alerts"
          description="Receive important system alerts and maintenance notices"
          enabled={settings.systemAlerts}
          onChange={() => handleToggle('systemAlerts')}
        />
        <NotificationToggle
          label="Weekly Reports"
          description="Receive weekly summary reports"
          enabled={settings.weeklyReports}
          onChange={() => handleToggle('weeklyReports')}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={saveSettings} icon={<Save className="h-4 w-4" />}>
          Save Changes
        </Button>
      </div>
    </Card>
  );
};

export default NotificationSettings;
