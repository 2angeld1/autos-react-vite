import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Smartphone, Globe, Save } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Badge from '@/components/common/Badge';
import toast from 'react-hot-toast';

const SecuritySettings: React.FC = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [sessions] = useState([
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

export default SecuritySettings;
