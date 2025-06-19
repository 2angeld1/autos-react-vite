import React from 'react';
import { Edit, Trash2, Eye, MoreHorizontal, Shield, ShieldOff } from 'lucide-react';
import Table, { Column } from '@/components/common/Table';
import Button from '@/components/common/Button';
import { User } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
  onToggleStatus: (user: User) => void;
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
  onToggleStatus,
  sortKey,
  sortDirection,
  onSort,
}) => {
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

  const rowActions = (user: User) => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setShowActionsMenu(showActionsMenu === user.id ? null : user.id);
        }}
        icon={<MoreHorizontal className="h-4 w-4" />}
        aria-label="More actions"
      />
      
      {showActionsMenu === user.id && (
        <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 min-w-[160px]">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(user);
                setShowActionsMenu(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(user);
                setShowActionsMenu(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4" />
              Edit User
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(user);
                setShowActionsMenu(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {user.isActive ? (
                <>
                  <ShieldOff className="h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Activate
                </>
              )}
            </button>
            <div className="border-t border-gray-100"></div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(user);
                setShowActionsMenu(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );

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