import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, UserPlus, Trash2, Shield, ShieldOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import UserFiltersComponent from '@/components/users/UserFilters';
import Modal from '@/components/common/Modal';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { useUsers } from '@/hooks/pages/useUsers';
import toast from 'react-hot-toast';
import { fadeIn, slideUp, staggerContainer } from '@/animations/variants';

const Users: React.FC = () => {
  const { t } = useTranslation();
  const { state, actions } = useUsers();

  const {
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
    showViewModal,
    userToView,
    generatedPassword,
    showPasswordModal,
    usersData,
    usersLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    toggleLoading,
  } = state;

  const breadcrumbItems = [
    { label: t('nav.users'), current: true },
  ];

  const exportUsers = () => {
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
            onClick={actions.handleAddUser}
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
          onFiltersChange={actions.handleFiltersChange}
          onReset={actions.handleResetFilters}
          loading={usersLoading}
        />
      </motion.div>

      {/* Table */}
      <motion.div variants={slideUp}>
        <UserTable
          users={usersData?.users || []}
          loading={usersLoading}
          onEdit={actions.handleEditUser}
          onDelete={actions.handleDeleteUser}
          onView={actions.handleViewUser}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={actions.handleSort}
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
              onClick={() => actions.setCurrentPage(currentPage - 1)}
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
                  onClick={() => actions.setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === usersData.pages}
              onClick={() => actions.setCurrentPage(currentPage + 1)}
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
        onClose={() => actions.setShowUserForm(false)}
        onSubmit={actions.handleUserSubmit}
        loading={createLoading || updateLoading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => actions.setShowDeleteModal(false)}
        title={t('users.deleteUser')}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => actions.setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={actions.confirmDelete}
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
        onClose={() => { actions.setShowPasswordModal(false); actions.setGeneratedPassword(null); }}
        title={t('users.generatedPassword')}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => { actions.setShowPasswordModal(false); actions.setGeneratedPassword(null); }}
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
        onClose={() => actions.setShowToggleStatusModal(false)}
        title={userToToggle?.isActive ? t('users.deactivateUser') : t('users.activateUser')}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => actions.setShowToggleStatusModal(false)}
              disabled={toggleLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant={userToToggle?.isActive ? "danger" : "primary"}
              onClick={actions.confirmToggleStatus}
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

      {/* View User Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => actions.setShowViewModal(false)}
        title={t('users.user')}
        footer={
          <Button
            variant="outline"
            onClick={() => actions.setShowViewModal(false)}
          >
            {t('common.close')}
          </Button>
        }
      >
        {userToView && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center">
              {userToView.avatar ? (
                <img
                  src={userToView.avatar}
                  alt={userToView.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-gray-100 shadow-sm mb-4"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mb-4 border-4 border-gray-50 text-primary-600 text-3xl font-bold uppercase">
                  {userToView.name.charAt(0)}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{userToView.name}</h3>
              <p className="text-gray-500">{userToView.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  {t('users.role')}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userToView.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                  }`}>
                  {userToView.role === 'admin' ? (
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Admin
                    </span>
                  ) : 'User'}
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  {t('users.status')}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userToView.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {userToView.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  {t('users.joined')}
                </span>
                <span className="text-sm text-gray-900">
                  {new Date(userToView.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  Last Update
                </span>
                <span className="text-sm text-gray-900">
                  {userToView.updatedAt ? new Date(userToView.updatedAt).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Users;