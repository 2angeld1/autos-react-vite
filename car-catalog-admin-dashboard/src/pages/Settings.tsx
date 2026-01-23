import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save,
  Mail,
  Lock,
  Smartphone,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authSlice';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import toast from 'react-hot-toast';
import { fadeIn, slideUp, staggerContainer } from '@/animations/variants';

interface SettingsSection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const settingsSections: SettingsSection[] = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'appearance', name: 'Appearance', icon: Palette },
  { id: 'preferences', name: 'Preferences', icon: Globe },
];

// Profile Settings Component
const ProfileSettings: React.FC = () => {
  const { user, updateProfile, loading, logout } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [showPasswordFields, setShowPasswordFields] = React.useState(false);
  const countdownRef = React.useRef<number | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: null as File | null,
      password: '',
      confirmPassword: '',
    },
  });

  const watchPassword = watch('password');
  const toastIdRef = React.useRef<string | null>(null);

  // Start countdown function with toast
  const startCountdown = React.useCallback(() => {
    console.log('🚀 startCountdown called');
    countdownRef.current = 10;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Create persistent toast
    toastIdRef.current = toast.custom(
      (t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Contraseña Actualizada
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Cerrando sesión en <span className="font-bold text-primary-600">{countdownRef.current}</span> segundos...
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                logout();
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
            >
              Cerrar Ahora
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, id: 'password-countdown' }
    );

    intervalRef.current = setInterval(() => {
      if (countdownRef.current !== null && countdownRef.current > 0) {
        countdownRef.current--;
        console.log('⏱️ Countdown tick:', countdownRef.current);

        // Update the toast with new countdown
        if (toastIdRef.current) {
          toast.custom(
            (t) => (
              <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Contraseña Actualizada
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Cerrando sesión en <span className="font-bold text-primary-600">{countdownRef.current}</span> segundos...
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      logout();
                    }}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
                  >
                    Cerrar Ahora
                  </button>
                </div>
              </div>
            ),
            { duration: Infinity, id: 'password-countdown' }
          );
        }

        if (countdownRef.current <= 0) {
          console.log('🚪 Logging out...');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          toast.dismiss('password-countdown');
          logout();
        }
      }
    }, 1000);
  }, [logout]);

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (toastIdRef.current) {
        toast.dismiss('password-countdown');
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File too large (max 2MB)');
        return;
      }
      setValue('avatar', file, { shouldDirty: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit = async (data: any) => {
    try {
      console.log('📝 onSubmit called with data:', data);
      console.log('🔑 showPasswordFields:', showPasswordFields);

      // Create payload only with necessary fields
      const payload: any = {
        name: data.name,
        email: data.email,
        avatar: data.avatar
      };

      const passwordChanged = !!(data.password && showPasswordFields);
      console.log('🔐 passwordChanged:', passwordChanged);

      // Only include password if provided
      if (passwordChanged) {
        payload.password = data.password;
      }

      console.log('📤 Calling updateProfile with payload:', payload);
      await updateProfile(payload);
      console.log('✅ updateProfile completed');

      if (passwordChanged) {
        console.log('🕐 Starting countdown...');
        startCountdown();
        setShowPasswordFields(false);
      } else {
        toast.success('Perfil actualizado correctamente');
      }

      // Clear password fields
      setValue('password', '');
      setValue('confirmPassword', '');

    } catch (error: any) {
      console.error('❌ onSubmit error:', error);
      toast.error(error.message || 'Error al actualizar perfil');
    }
  };

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <User className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center relative">
              {avatarPreview || user?.avatar ? (
                <img
                  src={avatarPreview || user?.avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>

            {/* Hover Overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white backdrop-blur-[1px]"
              title="Change Profile Photo"
            >
              <Camera className="h-6 w-6 drop-shadow-md" />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Profile Photo</p>
            <p className="text-sm text-gray-500">
              JPG, PNG or WebP. Max size 2MB.
            </p>
          </div>
        </div>

        {/* Name */}
        <Input
          label="Full Name"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
          startIcon={<User className="h-4 w-4" />}
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
          startIcon={<Mail className="h-4 w-4" />}
        />

        {/* Optional Password Change Fields */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
              <p className="text-xs text-gray-500 mt-1">Update your password securely</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowPasswordFields(!showPasswordFields);
                if (!showPasswordFields) {
                  // When opening, ensure fields are clear
                  setValue('password', '');
                  setValue('confirmPassword', '');
                }
              }}
            >
              {showPasswordFields ? 'Cancel' : 'Change Password'}
            </Button>
          </div>

          <AnimatePresence>
            {showPasswordFields && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                  <Input
                    label="New Password"
                    type="password"
                    {...register('password', {
                      required: showPasswordFields ? 'New password is required' : false,
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    error={errors.password?.message}
                    placeholder="Enter new password"
                    startIcon={<Lock className="h-4 w-4" />}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    {...register('confirmPassword', {
                      required: showPasswordFields ? 'Please confirm your password' : false,
                      validate: (value) => {
                        if (!showPasswordFields) return true;
                        return value === watchPassword || 'Passwords do not match';
                      }
                    })}
                    error={errors.confirmPassword?.message}
                    placeholder="Confirm new password"
                    startIcon={<Lock className="h-4 w-4" />}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* Role Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <div className="flex items-center">
            <Badge variant={user?.role === 'admin' ? 'success' : 'default'}>
              {user?.role === 'admin' ? 'Administrator' : 'User'}
            </Badge>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
            disabled={!isDirty}
            icon={<Save className="h-4 w-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

// Notification Settings Component
const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
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

// Security Settings Component
const SecuritySettings: React.FC = () => {
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const [sessions] = React.useState([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: '2 minutes ago',
      current: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: '1 hour ago',
      current: false,
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onChangePassword = async () => {
    try {
      // Change password API call
      toast.success('Password changed successfully');
      reset();
      setShowChangePassword(false);
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const revokeSession = async () => {
    try {
      // Revoke session API call
      toast.success('Session revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke session');
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Lock className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? 'Cancel' : 'Change Password'}
          </Button>
        </div>

        {showChangePassword && (
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              {...register('currentPassword', { required: 'Current password is required' })}
              error={errors.currentPassword?.message}
              startIcon={<Lock className="h-4 w-4" />}
            />
            <Input
              label="New Password"
              type="password"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={errors.newPassword?.message}
              startIcon={<Lock className="h-4 w-4" />}
            />
            <Input
              label="Confirm New Password"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value =>
                  value === newPassword || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
              startIcon={<Lock className="h-4 w-4" />}
            />
            <div className="flex justify-end">
              <Button type="submit" icon={<Save className="h-4 w-4" />}>
                Update Password
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
          </div>
          <Badge variant="warning">Not Enabled</Badge>
        </div>
        <Button variant="outline">
          Enable 2FA
        </Button>
      </Card>

      {/* Active Sessions */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
        </div>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {session.device}
                    {session.current && (
                      <Badge variant="success" className="ml-2">Current</Badge>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {session.location} • {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={revokeSession}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Appearance Settings Component
const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

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

// Preferences Settings Component
const PreferencesSettings: React.FC = () => {
  const [preferences, setPreferences] = React.useState({
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

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <Globe className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
      </div>

      <div className="space-y-4">
        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            value={preferences.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        {/* Date Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Format
          </label>
          <select
            value={preferences.dateFormat}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="MM/dd/yyyy">MM/dd/yyyy</option>
            <option value="dd/MM/yyyy">dd/MM/yyyy</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd</option>
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={preferences.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>

        {/* Items per page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Items per page
          </label>
          <select
            value={preferences.itemsPerPage}
            onChange={(e) => handleChange('itemsPerPage', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button icon={<Save className="h-4 w-4" />}>
          Save Changes
        </Button>
      </div>
    </Card>
  );
};

// Main Settings Component
const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'preferences':
        return <PreferencesSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="p-6"
    >
      <motion.div variants={slideUp} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <motion.div variants={slideUp} className="md:col-span-1">
          <nav className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {section.name}
                </button>
              );
            })}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <motion.div variants={slideUp} className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;