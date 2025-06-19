import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (url: string, config?: AxiosRequestConfig) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = unknown>(options: UseApiOptions = {}): UseApiReturn<T> {
  const { immediate = false } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (url: string, config: AxiosRequestConfig = {}): Promise<T | null> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response: AxiosResponse<T> = await api({
          url,
          ...config,
        });

        setState({
          data: response.data,
          loading: false,
          error: null,
        });

        return response.data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
}

// Hook específicos para métodos HTTP
export function useGet<T = unknown>(url?: string, options: UseApiOptions = {}) {
  const apiHook = useApi<T>(options);
  
  const execute = useCallback((customUrl?: string) => {
    const targetUrl = customUrl || url;
    if (!targetUrl) {
      throw new Error('URL is required');
    }
    return apiHook.execute(targetUrl, { method: 'GET' });
  }, [apiHook.execute, url]);

  // Auto-execute if immediate and URL provided
  useEffect(() => {
    if (options.immediate && url) {
      execute();
    }
  }, [execute, options.immediate, url]);

  return {
    ...apiHook,
    execute,
  };
}

export function usePost<T = unknown>() {
  const apiHook = useApi<T>();
  
  const execute = useCallback((url: string, data?: any) => {
    return apiHook.execute(url, { 
      method: 'POST',
      data,
    });
  }, [apiHook.execute]);

  return {
    ...apiHook,
    execute,
  };
}

export function usePut<T = unknown>() {
  const apiHook = useApi<T>();
  
  const execute = useCallback((url: string, data?: any) => {
    return apiHook.execute(url, { 
      method: 'PUT',
      data,
    });
  }, [apiHook.execute]);

  return {
    ...apiHook,
    execute,
  };
}

export function useDelete<T = unknown>() {
  const apiHook = useApi<T>();
  
  const execute = useCallback((url: string) => {
    return apiHook.execute(url, { method: 'DELETE' });
  }, [apiHook.execute]);

  return {
    ...apiHook,
    execute,
  };
}

export default useApi;