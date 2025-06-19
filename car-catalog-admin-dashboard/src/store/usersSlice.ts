import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User, UserFilters, PaginatedResponse } from '@/types';
import { usersService } from '@/services/users';

interface UsersState {
  // Data
  users: User[];
  currentUser: User | null;
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  
  // Filters and sorting
  filters: UserFilters;
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  
  // Loading states
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  toggling: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  fetchUsers: (params?: any) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  createUser: (userData: any) => Promise<void>;
  updateUser: (id: string, userData: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  changeUserRole: (id: string, role: 'admin' | 'user') => Promise<void>;
  resetUserPassword: (id: string) => Promise<string>;
  setFilters: (filters: Partial<UserFilters>) => void;
  setSorting: (key: string, direction: 'asc' | 'desc') => void;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
  reset: () => void;
}

const initialFilters: UserFilters = {
  search: '',
  role: '',
  isActive: '',
  lastLoginDays: '',
};

export const useUsersStore = create<UsersState>()(
  devtools(
    (set, get) => ({
      // Initial state
      users: [],
      currentUser: null,
      totalUsers: 0,
      totalPages: 0,
      currentPage: 1,
      filters: initialFilters,
      sortKey: 'createdAt',
      sortDirection: 'desc',
      loading: false,
      saving: false,
      deleting: false,
      toggling: false,
      error: null,

      // Actions
      fetchUsers: async (params) => {
        set({ loading: true, error: null });
        try {
          const state = get();
          const queryParams = {
            ...state.filters,
            page: state.currentPage,
            limit: 10,
            sortBy: state.sortKey,
            sortOrder: state.sortDirection,
            ...params,
          };

          const response = await usersService.getUsers(queryParams);
          
          set({
            users: response.data,
            totalUsers: response.total,
            totalPages: response.pages,
            currentPage: response.page,
            loading: false,
          });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to fetch users',
          });
        }
      },

      fetchUserById: async (id) => {
        set({ loading: true, error: null });
        try {
          const user = await usersService.getUserById(id);
          set({
            currentUser: user,
            loading: false,
          });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to fetch user',
          });
        }
      },

      createUser: async (userData) => {
        set({ saving: true, error: null });
        try {
          const newUser = await usersService.createUser(userData);
          const state = get();
          set({
            users: [newUser, ...state.users],
            totalUsers: state.totalUsers + 1,
            saving: false,
          });
        } catch (error: any) {
          set({
            saving: false,
            error: error.message || 'Failed to create user',
          });
          throw error;
        }
      },

      updateUser: async (id, userData) => {
        set({ saving: true, error: null });
        try {
          const updatedUser = await usersService.updateUser(id, userData);
          const state = get();
          set({
            users: state.users.map(user => 
              user.id === id ? updatedUser : user
            ),
            currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
            saving: false,
          });
        } catch (error: any) {
          set({
            saving: false,
            error: error.message || 'Failed to update user',
          });
          throw error;
        }
      },

      deleteUser: async (id) => {
        set({ deleting: true, error: null });
        try {
          await usersService.deleteUser(id);
          const state = get();
          set({
            users: state.users.filter(user => user.id !== id),
            totalUsers: state.totalUsers - 1,
            currentUser: state.currentUser?.id === id ? null : state.currentUser,
            deleting: false,
          });
        } catch (error: any) {
          set({
            deleting: false,
            error: error.message || 'Failed to delete user',
          });
          throw error;
        }
      },

      toggleUserStatus: async (id) => {
        set({ toggling: true, error: null });
        try {
          const updatedUser = await usersService.toggleUserStatus(id);
          const state = get();
          set({
            users: state.users.map(user => 
              user.id === id ? updatedUser : user
            ),
            currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
            toggling: false,
          });
        } catch (error: any) {
          set({
            toggling: false,
            error: error.message || 'Failed to toggle user status',
          });
          throw error;
        }
      },

      changeUserRole: async (id, role) => {
        set({ saving: true, error: null });
        try {
          const updatedUser = await usersService.changeUserRole(id, role);
          const state = get();
          set({
            users: state.users.map(user => 
              user.id === id ? updatedUser : user
            ),
            currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
            saving: false,
          });
        } catch (error: any) {
          set({
            saving: false,
            error: error.message || 'Failed to change user role',
          });
          throw error;
        }
      },

      resetUserPassword: async (id) => {
        set({ saving: true, error: null });
        try {
          const result = await usersService.resetUserPassword(id);
          set({ saving: false });
          return result.temporaryPassword;
        } catch (error: any) {
          set({
            saving: false,
            error: error.message || 'Failed to reset user password',
          });
          throw error;
        }
      },

      setFilters: (newFilters) => {
        const state = get();
        set({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1, // Reset to first page when filters change
        });
      },

      setSorting: (key, direction) => {
        set({
          sortKey: key,
          sortDirection: direction,
          currentPage: 1, // Reset to first page when sorting changes
        });
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          users: [],
          currentUser: null,
          totalUsers: 0,
          totalPages: 0,
          currentPage: 1,
          filters: initialFilters,
          sortKey: 'createdAt',
          sortDirection: 'desc',
          loading: false,
          saving: false,
          deleting: false,
          toggling: false,
          error: null,
        });
      },
    }),
    {
      name: 'users-store',
    }
  )
);