import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Camera, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import toast from 'react-hot-toast';
import { useSettings } from '@/hooks/pages/useSettings';

const ProfileSettings: React.FC = () => {
  const { 
    user, 
    loading, 
    avatarPreview, 
    setAvatarPreview, 
    showPasswordFields, 
    setShowPasswordFields, 
    updateProfile, 
    startCountdown 
  } = useSettings();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

export default ProfileSettings;
