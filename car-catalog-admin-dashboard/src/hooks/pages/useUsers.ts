import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';
import { User, ApiResponse } from '@/types';
import { UserFilters } from '@/components/users/UserFilters';

export const useUsers = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    isActive: '',
    lastLoginDays: '',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showToggleStatusModal, setShowToggleStatusModal] = useState(false);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // API hooks
  const { 
    data: usersResponse, 
    loading: usersLoading, 
    execute: fetchUsers 
  } = useGet<{ users: User[]; total: number; pages: number }>('/admin/users');

  // Normalize API response shape
  const usersData = useMemo(() => {
    if (!usersResponse) return null;
    if ((usersResponse as any).data) return (usersResponse as any).data;
    return usersResponse;
  }, [usersResponse]);

  const { execute: createUser, loading: createLoading } = usePost<ApiResponse<any>>();
  const { execute: updateUser, loading: updateLoading } = usePut<ApiResponse<any>>();
  const { execute: deleteUser, loading: deleteLoading } = useDelete<ApiResponse<any>>();
  const { execute: toggleUserStatus, loading: toggleLoading } = usePut<ApiResponse<any>>();

  const refreshUsers = useCallback(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    params.append('page', currentPage.toString());
    params.append('limit', pageSize.toString());
    params.append('sortBy', sortKey);
    params.append('sortOrder', sortDirection);

    fetchUsers(`?${params.toString()}`);
  }, [filters, currentPage, pageSize, sortKey, sortDirection, fetchUsers]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setShowUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleToggleUserStatus = (user: User) => {
    setUserToToggle(user);
    setShowToggleStatusModal(true);
  };

  const generatePassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let result = '';
    const array = new Uint32Array(length);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars.charAt(array[i] % chars.length);
      }
    } else {
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return result;
  };

  const handleUserSubmit = async (formData: FormData) => {
    try {
      if (selectedUser) {
        const response = await updateUser(`/admin/users/${selectedUser.id}`, formData);
        if (response?.success) {
          toast.success(t('users.userUpdated'));
          refreshUsers();
        }
      } else {
        let generated: string | null = null;
        const pw = formData.get('password');
        if (!pw || (typeof pw === 'string' && pw.trim() === '')) {
          generated = generatePassword(12);
          formData.set('password', generated);
        }

        const response = await createUser('/admin/users', formData);
        if (response?.success) {
          toast.success(t('users.userCreated'));
          refreshUsers();
          if (generated) {
            setGeneratedPassword(generated);
            setShowPasswordModal(true);
          }
        }
      }
      setShowUserForm(false);
    } catch (error: any) {
      toast.error(error.message || t('errors.somethingWentWrong'));
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await deleteUser(`/admin/users/${userToDelete.id}`);
      if (response?.success) {
        toast.success(t('users.userDeleted'));
        setShowDeleteModal(false);
        setUserToDelete(null);
        refreshUsers();
      }
    } catch (error: any) {
      toast.error(error.message || t('errors.failedToDelete'));
    }
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;

    try {
      const response = await toggleUserStatus(`/admin/users/${userToToggle.id}/toggle-status`, {});
      if (response?.success) {
        toast.success(userToToggle.isActive ? t('users.userDeactivated') : t('users.userActivated'));
        setShowToggleStatusModal(false);
        setUserToToggle(null);
        refreshUsers();
      }
    } catch (error: any) {
      toast.error(error.message || t('errors.failedToUpdate'));
    }
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      role: '',
      isActive: '',
      lastLoginDays: '',
    });
    setCurrentPage(1);
  };

  return {
    state: {
      filters,
      currentPage,
      pageSize,
      sortKey,
      sortDirection,
      showUserForm,
      selectedUser,
      showDeleteModal,
      userToDelete,
      showToggleStatusModal,
      userToToggle,
      generatedPassword,
      showPasswordModal,
      usersData,
      usersLoading,
      createLoading,
      updateLoading,
      deleteLoading,
      toggleLoading,
    },
    actions: {
      setFilters,
      setCurrentPage,
      setShowUserForm: (val: boolean) => setShowUserForm(val),
      setShowDeleteModal: (val: boolean) => setShowDeleteModal(val),
      setShowToggleStatusModal: (val: boolean) => setShowToggleStatusModal(val),
      setShowPasswordModal: (val: boolean) => setShowPasswordModal(val),
      setGeneratedPassword,
      setUserToDelete,
      setUserToToggle,
      handleAddUser,
      handleEditUser,
      handleDeleteUser,
      handleToggleUserStatus,
      handleUserSubmit,
      confirmDelete,
      confirmToggleStatus,
      handleSort,
      handleFiltersChange,
      handleResetFilters,
    },
  };
};
