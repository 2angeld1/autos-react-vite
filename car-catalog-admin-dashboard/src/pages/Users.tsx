import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, UserPlus, Trash2, Shield, ShieldOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import UserFiltersComponent, { UserFilters } from '@/components/users/UserFilters';
import Modal from '@/components/common/Modal';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';
import { User, ApiResponse } from '@/types';
import toast from 'react-hot-toast';
import { fadeIn, slideUp, staggerContainer } from '@/animations/variants';

const Users: React.FC = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = React.useState<UserFilters>({
    search: '',
    role: '',
    isActive: '',
    lastLoginDays: '',
  });
  
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortKey, setSortKey] = React.useState<string>('createdAt');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  
  const [showUserForm, setShowUserForm] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | undefined>();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [showToggleStatusModal, setShowToggleStatusModal] = React.useState(false);
  const [userToToggle, setUserToToggle] = React.useState<User | null>(null);
  const [generatedPassword, setGeneratedPassword] = React.useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);

  // API hooks
  const { 
    data: usersResponse, 
    loading: usersLoading, 
    execute: fetchUsers 
  } = useGet<{ users: User[]; total: number; pages: number }>('/admin/users');

  // Normalize API response shape: some endpoints return { success, data: { users,... } }
  const usersData: any = React.useMemo(() => {
    if (!usersResponse) return null;
    // If API returned wrapper { success, data } unwrap it
    if ((usersResponse as any).data) return (usersResponse as any).data;
    return usersResponse;
  }, [usersResponse]);

  const { execute: createUser, loading: createLoading } = usePost<ApiResponse<any>>();
  const { execute: updateUser, loading: updateLoading } = usePut<ApiResponse<any>>();
  const { execute: deleteUser, loading: deleteLoading } = useDelete<ApiResponse<any>>();
  const { execute: toggleUserStatus, loading: toggleLoading } = usePut<ApiResponse<any>>();

  // Fetch users when filters or pagination changes
  React.useEffect(() => {
    const params = new URLSearchParams();
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    // Add pagination and sorting
    params.append('page', currentPage.toString());
    params.append('limit', pageSize.toString());
    params.append('sortBy', sortKey);
    params.append('sortOrder', sortDirection);

    fetchUsers(`?${params.toString()}`);
  }, [filters, currentPage, sortKey, sortDirection, fetchUsers, pageSize]);

  const breadcrumbItems = [
    { label: t('nav.users'), current: true },
  ];

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

  const handleViewUser = (user: User) => {
    // Navigate to user details or show in modal
    console.log('View user:', user);
  };

  const handleUserSubmit = async (formData: FormData) => {
    try {
      if (selectedUser) {
        // Update existing user
        const response = await updateUser(`/admin/users/${selectedUser.id}`, formData);
        if (response?.success) {
          toast.success(t('users.userUpdated'));
          fetchUsers();
        }
      } else {
        // Create new user
        // If no password provided, generate one client-side and set it in the FormData
        let generated: string | null = null;
        const pw = formData.get('password');
        if (!pw || (typeof pw === 'string' && pw.trim() === '')) {
          generated = generatePassword(12);
          formData.set('password', generated);
        }

        const response = await createUser('/admin/users', formData);
        if (response?.success) {
          toast.success(t('users.userCreated'));
          fetchUsers();
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

  // Generate a random secure password
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

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await deleteUser(`/admin/users/${userToDelete.id}`);
      if (response?.success) {
        toast.success(t('users.userDeleted'));
        setShowDeleteModal(false);
        setUserToDelete(null);
        fetchUsers();
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
        fetchUsers();
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
    setCurrentPage(1); // Reset to first page when filters change
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

  const exportUsers = () => {
    // Implement CSV export
    toast.success(t('common.comingSoon'));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <motion.div
        variants={staggerContainer}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <motion.div variants={slideUp}>
          <h1 className="text-2xl font-bold text-gray-900">{t('users.title')}</h1>
          <p className="text-gray-600">
            {t('users.manageUsers')}
            {usersData && ` • ${usersData.total} ${t('common.total').toLowerCase()}`}
          </p>
        </motion.div>
        
        <motion.div variants={slideUp} className="mt-4 sm:mt-0 flex gap-3">
          <Button
            variant="outline"
            onClick={exportUsers}
            icon={<Download className="h-4 w-4" />}
          >
            {t('common.export')}
          </Button>
          <Button
            onClick={handleAddUser}
            icon={<UserPlus className="h-4 w-4" />}
          >
            {t('users.addUser')}
          </Button>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={slideUp}>
        <UserFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
          loading={usersLoading}
        />
      </motion.div>

      {/* Table */}
      <motion.div variants={slideUp}>
        <UserTable
          users={usersData?.users || []}
          loading={usersLoading}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onView={handleViewUser}
          onToggleStatus={handleToggleUserStatus}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </motion.div>

      {/* Pagination */}
      {usersData && usersData.pages > 1 && (
        <motion.div variants={slideUp} className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            {t('table.showing')} {((currentPage - 1) * pageSize) + 1} {t('table.to')}{' '}
            {Math.min(currentPage * pageSize, usersData.total)} {t('table.of')}{' '}
            {usersData.total} {t('table.results')}
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {t('table.previous')}
            </Button>
            
            {/* Page numbers */}
            {[...Array(Math.min(5, usersData.pages))].map((_, i) => {
              const pageNumber = Math.max(1, currentPage - 2) + i;
              if (pageNumber > usersData.pages) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === usersData.pages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {t('table.next')}
            </Button>
          </div>
        </motion.div>
      )}

      {/* User Form Modal */}
      <UserForm
        user={selectedUser}
        isOpen={showUserForm}
        onClose={() => setShowUserForm(false)}
        onSubmit={handleUserSubmit}
        loading={createLoading || updateLoading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('users.deleteUser')}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteLoading}
              icon={<Trash2 className="h-4 w-4" />}
            >
              {t('users.deleteUser')}
            </Button>
          </>
        }
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('users.confirmDelete')}
          </h3>
          {userToDelete && (
            <p className="text-sm text-gray-500 mb-4">
              {userToDelete.name} ({userToDelete.email}) {t('users.willBeRemoved')}
            </p>
          )}
          <p className="text-sm text-gray-400">
            {t('common.cannotBeUndone')}
          </p>
        </div>
      </Modal>

      {/* Generated Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => { setShowPasswordModal(false); setGeneratedPassword(null); }}
        title={t('users.generatedPassword')}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => { setShowPasswordModal(false); setGeneratedPassword(null); }}
            >
              {t('common.close')}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (generatedPassword) {
                  navigator.clipboard?.writeText(generatedPassword).then(() => {
                    toast.success(t('users.passwordCopied'));
                  }).catch(() => {
                    toast.error(t('users.passwordCopyFailed'));
                  });
                }
              }}
            >
              {t('users.copyPassword')}
            </Button>
          </>
        }
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('users.userCreated')}</h3>
          <p className="text-sm text-gray-500 mb-4">{t('users.passwordGenerated')}</p>
          <div className="mx-auto bg-gray-100 px-4 py-3 rounded-md inline-block">
            <code className="text-sm break-all">{generatedPassword}</code>
          </div>
        </div>
      </Modal>

      {/* Toggle Status Confirmation Modal */}
      <Modal
        isOpen={showToggleStatusModal}
        onClose={() => setShowToggleStatusModal(false)}
        title={userToToggle?.isActive ? t('users.deactivateUser') : t('users.activateUser')}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowToggleStatusModal(false)}
              disabled={toggleLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant={userToToggle?.isActive ? "danger" : "primary"}
              onClick={confirmToggleStatus}
              loading={toggleLoading}
              icon={userToToggle?.isActive ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
            >
              {userToToggle?.isActive ? t('users.deactivate') : t('users.activate')}
            </Button>
          </>
        }
      >
        <div className="text-center">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
            userToToggle?.isActive ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {userToToggle?.isActive ? (
              <ShieldOff className="h-6 w-6 text-red-600" />
            ) : (
              <Shield className="h-6 w-6 text-green-600" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {userToToggle?.isActive ? t('users.confirmDeactivate') : t('users.confirmActivate')}
          </h3>
          {userToToggle && (
            <p className="text-sm text-gray-500 mb-4">
              {userToToggle.name} ({userToToggle.email}){' '}
              {userToToggle.isActive ? t('users.willBeDeactivated') : t('users.willBeActivated')}
            </p>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};

export default Users;