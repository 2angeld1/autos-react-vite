import React from 'react';
import { Edit, Trash2, Eye, MoreHorizontal, Shield } from 'lucide-react';
import Table, { Column } from '@/components/common/Table';
import Button from '@/components/common/Button';
import { User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import { useAuth } from '@/hooks/useAuth';

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading = false,
  onEdit,
  onDelete,
  onView,
  sortKey,
  sortDirection,
  onSort,
}) => {
  const { user: currentUser } = useAuth();
  const [showActionsMenu, setShowActionsMenu] = React.useState<string | null>(null);

  const columns: Column<User>[] = [
    {
      key: 'avatar',
      title: 'Avatar',
      width: '60px',
      render: (value, record) => (
        <div className="flex-shrink-0">
          {value ? (
            <img
              src={value}
              alt={record.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {record.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      title: 'User',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      width: '100px',
      render: (value) => {
        const roleColors = {
          admin: 'bg-purple-100 text-purple-800',
          user: 'bg-blue-100 text-blue-800',
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[value as keyof typeof roleColors]}`}>
            {value === 'admin' ? (
              <>
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </>
            ) : (
              'User'
            )}
          </span>
        );
      },
    },
    {
      key: 'isActive',
      title: 'Status',
      width: '100px',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      sortable: true,
      width: '150px',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value 
            ? formatDistanceToNow(new Date(value), { addSuffix: true })
            : 'Never'
          }
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Joined',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const rowActions = (user: User) => {
    const userId = user.id || user._id;
    if (!userId) return null;

    // Detectar si está cerca del final para abrir hacia arriba (últimas 2 filas)
    const index = users.findIndex(u => (u.id || u._id) === userId);
    const isNearBottom = index >= users.length - 2 && users.length > 2;

    // Check if row is current user (handle both id and _id)
    const currentUserId = currentUser ? (currentUser.id || (currentUser as any)._id) : null;
    const isCurrentUser = currentUserId && userId && currentUserId === userId;

    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowActionsMenu(prev => prev === userId ? null : userId);
          }}
          icon={<MoreHorizontal className="h-4 w-4" />}
          aria-label="More actions"
          className="dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
        />

        {showActionsMenu === userId && (
          <div
            className={clsx(
              "absolute right-0 bg-white dark:bg-gray-800 rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-white/10 z-[100] min-w-[200px] py-2 transition-all duration-200 border dark:border-gray-700",
              isNearBottom ? "bottom-full mb-2" : "top-full mt-2"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowActionsMenu(null);
                onView(user);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            {!isCurrentUser && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowActionsMenu(null);
                  onEdit(user);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit className="h-4 w-4" />
                Edit User
              </button>
            )}

            {!isCurrentUser && (
              <>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowActionsMenu(null);
                    onDelete(user);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete User
                </button>
              </>
            )}

            {isCurrentUser && (
              <div className="px-4 py-2 text-xs text-gray-400 italic text-center">
                Current User
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Close actions menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowActionsMenu(null);
    };

    if (showActionsMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showActionsMenu]);

  return (
    <Table
      columns={columns}
      data={users}
      loading={loading}
      rowKey="id"
      onSort={onSort}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onRowClick={(user) => onView(user)}
      rowActions={rowActions}
      emptyText="No users found"
      className="cursor-pointer"
    />
  );
};

export default UserTable;