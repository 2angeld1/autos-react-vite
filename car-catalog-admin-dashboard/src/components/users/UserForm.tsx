import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import { apiClient } from '@/services/api'; // Import apiClient directly
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import { User } from '@/types';

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [selectedAvatar, setSelectedAvatar] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
    user?.avatar || null
  );
  const [isUploading, setIsUploading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    } : {
      role: 'user',
      isActive: true,
    },
  });

  // Reset form when user changes (fixes bug where previous user data persists)
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
      setAvatarPreview(user.avatar || null);
      setSelectedAvatar(null);
    } else {
      reset({
        name: '',
        email: '',
        role: 'user',
        isActive: true, // Default to active for new users
        password: '',
        confirmPassword: ''
      });
      setAvatarPreview(null);
      setSelectedAvatar(null);
    }
  }, [user, reset]);

  const watchPassword = watch('password');
  const isEditing = !!user;

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setSelectedAvatar(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setSelectedAvatar(null);
    setAvatarPreview(user?.avatar || null);
  };

  const onFormSubmit = async (data: UserFormData) => {
    try {
      setIsUploading(true);
      let avatarUrl = user?.avatar;

      // 1. Upload Avatar if selected
      if (selectedAvatar) {
        const formData = new FormData();
        formData.append('files', selectedAvatar); // Backend expects 'files' array

        const uploadResponse = await apiClient.post('/files/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (uploadResponse.data && uploadResponse.data.data && uploadResponse.data.data.length > 0) {
          avatarUrl = uploadResponse.data.data[0].url; // Assuming backend returns { data: [{ url: ... }] }
        }
      }

      // 2. Prepare JSON Payload
      const payload: any = {
        name: data.name,
        email: data.email,
        role: data.role,
        isActive: data.isActive,
        avatar: avatarUrl
      };

      if (!isEditing && data.password) {
        payload.password = data.password;
      } else if (isEditing && data.password) {
        payload.password = data.password;
      }

      if (user) {
        payload.id = user.id;
      }

      await onSubmit(payload as any);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Let parent handle error toast, or re-throw
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedAvatar(null);
    setAvatarPreview(user?.avatar || null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={user ? 'Edit User' : 'Add New User'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading || isUploading}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading || isUploading}
            form="user-form"
          >
            {user ? 'Update User' : 'Create User'}
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Picture
          </label>
          
          <div className="flex justify-center">
            {avatarPreview ? (
              <div className="relative">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <label className="mt-3 cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            {avatarPreview ? 'Change Picture' : 'Upload Picture'}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <Input
            label="Full Name"
            {...register('name', { 
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            error={errors.name?.message}
            placeholder="John Doe"
          />

          <Input
            label="Email Address"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
            placeholder="john@example.com"
          />

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">
              {isEditing ? 'Change Password (Optional)' : 'Password (leave empty to auto-generate)'}
            </h4>
            
            <div className="relative">
              <Input
                label="Password"
                type="password"
                {...register('password', {
                  required: false,
                  minLength: { 
                    value: 6, 
                    message: 'Password must be at least 6 characters' 
                  }
                })}
                error={errors.password?.message}
                placeholder={isEditing ? 'Leave blank to keep current password' : 'Leave blank to auto-generate password'}
              />
            </div>

            {watchPassword && (
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type="password"
                  {...register('confirmPassword', {
                    required: watchPassword ? 'Please confirm password' : false,
                    validate: value => 
                      value === watchPassword || 'Passwords do not match'
                  })}
                  error={errors.confirmPassword?.message}
                  placeholder="Confirm password"
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              User account is active
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UserForm;