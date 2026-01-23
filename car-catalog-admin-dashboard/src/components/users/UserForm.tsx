import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import { apiClient } from '@/services/api';
import { authService } from '@/services/auth';
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

import toast from 'react-hot-toast';

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
        toast.error('El tamaño del archivo debe ser menor a 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen');
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


  const currentUser = authService.getUser();
  const showPasswordFields = !isEditing || (isEditing && currentUser?.id === user?.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={user ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading || isUploading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading || isUploading}
            form="user-form"
          >
            {user ? 'Actualizar Usuario' : 'Crear Usuario'}
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Foto de Perfil
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
            {avatarPreview ? 'Cambiar Foto' : 'Subir Foto'}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 2MB</p>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <Input
            label="Nombre Completo"
            {...register('name', { 
              required: 'El nombre es obligatorio',
              minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
            })}
            error={errors.name?.message}
            placeholder="Juan Pérez"
          />

          <Input
            label="Correo Electrónico"
            type="email"
            {...register('email', { 
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Dirección de correo inválida'
              }
            })}
            error={errors.email?.message}
            placeholder="juan@ejemplo.com"
          />

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              {...register('role', { required: 'El rol es obligatorio' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Password Fields */}
          {showPasswordFields && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">
                {isEditing ? 'Cambiar Contraseña (Opcional)' : 'Contraseña (dejar vacío para autogenerar)'}
              </h4>

              <div className="relative">
                <Input
                  label="Contraseña"
                  type="password"
                  {...register('password', {
                    required: false,
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  })}
                  error={errors.password?.message}
                  placeholder={isEditing ? 'Dejar en blanco para mantener la actual' : 'Dejar en blanco para autogenerar'}
                />
              </div>

              {watchPassword && (
                <div className="relative">
                  <Input
                    label="Confirmar Contraseña"
                    type="password"
                    {...register('confirmPassword', {
                      required: watchPassword ? 'Por favor confirma la contraseña' : false,
                      validate: value =>
                        value === watchPassword || 'Las contraseñas no coinciden'
                    })}
                    error={errors.confirmPassword?.message}
                    placeholder="Confirmar contraseña"
                  />
                </div>
              )}
            </div>
          )}
          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              La cuenta de usuario está activa
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UserForm;