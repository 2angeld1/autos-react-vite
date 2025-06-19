import React from 'react';
import { Plus, Download, UserPlus, Trash2, Shield, ShieldOff } from 'lucide-react';
import Button from '@/components/common/Button';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import UserFiltersComponent, { UserFilters } from '@/components/users/UserFilters';
import Modal from '@/components/common/Modal';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { useGet, usePost, usePut, useDelete } from '@/hooks/useApi';
import { User, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

const Users: React.FC = () => {
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

  // API hooks
  const { 
    data: usersResponse, 
    loading: usersLoading, 
    execute: fetchUsers 
  } = useGet<{ users: User[]; total: number; pages: number }>('/admin/users');

  const { execute: createUser, loading: createLoading } = usePost('/admin/users');
  const { execute: updateUser, loading: updateLoading } = usePut('/admin/users');
  const { execute: deleteUser, loading: deleteLoading } = useDelete('/admin/users');
  const { execute: toggleUserStatus, loading: toggleLoading } = usePut('/admin/users');

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
    { label: 'Users', current: true },
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
        const response = await updateUser(`/${selectedUser.id}`, formData);
        if (response?.success) {
          toast.success('User updated successfully');
          fetchUsers();
        }
      } else {
        // Create new user
        const response = await createUser('', formData);
        if (response?.success) {
          toast.success('User created successfully');
          fetchUsers();
        }
      }
      setShowUserForm(false);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await deleteUser(`/${userToDelete.id}`);
      if (response?.success) {
        toast.success('User deleted successfully');
        setShowDeleteModal(false);
        setUserToDelete(null);
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;

    try {
      const response = await toggleUserStatus(`/${userToToggle.id}/toggle-status`, {});
      if (response?.success) {
        toast.success(`User ${userToToggle.isActive ? 'deactivated' : 'activated'} successfully`);
        setShowToggleStatusModal(false);
        setUserToToggle(null);
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user status');
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
    toast.success('Export feature coming soon');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">
            Manage user accounts and permissions
            {usersResponse && ` • ${usersResponse.total} total users`}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button
            variant="outline"
            onClick={exportUsers}
            icon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
          <Button
            onClick={handleAddUser}
            icon={<UserPlus className="h-4 w-4" />}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <UserFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        loading={usersLoading}
      />

      {/* Table */}
      <UserTable
        users={usersResponse?.users || []}
        loading={usersLoading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onView={handleViewUser}
        onToggleStatus={handleToggleUserStatus}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Pagination */}
      {usersResponse && usersResponse.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, usersResponse.total)} of{' '}
            {usersResponse.total} results
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            {[...Array(Math.min(5, usersResponse.pages))].map((_, i) => {
              const pageNumber = Math.max(1, currentPage - 2) + i;
              if (pageNumber > usersResponse.pages) return null;
              
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
              disabled={currentPage === usersResponse.pages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
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
        title="Delete User"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteLoading}
              icon={<Trash2 className="h-4 w-4" />}
            >
              Delete User
            </Button>
          </>
        }
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure you want to delete this user?
          </h3>
          {userToDelete && (
            <p className="text-sm text-gray-500 mb-4">
              {userToDelete.name} ({userToDelete.email}) will be permanently removed.
            </p>
          )}
          <p className="text-sm text-gray-400">
            This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Toggle Status Confirmation Modal */}
      <Modal
        isOpen={showToggleStatusModal}
        onClose={() => setShowToggleStatusModal(false)}
        title={`${userToToggle?.isActive ? 'Deactivate' : 'Activate'} User`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowToggleStatusModal(false)}
              disabled={toggleLoading}
            >
              Cancel
            </Button>
            <Button
              variant={userToToggle?.isActive ? "danger" : "primary"}
              onClick={confirmToggleStatus}
              loading={toggleLoading}
              icon={userToToggle?.isActive ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
            >
              {userToToggle?.isActive ? 'Deactivate' : 'Activate'} User
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
            {userToToggle?.isActive ? 'Deactivate' : 'Activate'} user account?
          </h3>
          {userToToggle && (
            <p className="text-sm text-gray-500 mb-4">
              {userToToggle.name} ({userToToggle.email}) will be{' '}
              {userToToggle.isActive ? 'deactivated and unable to log in' : 'activated and able to log in'}.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Users;