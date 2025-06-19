import { useState, useMemo } from 'react';

export interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export interface PaginationActions {
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  reset: () => void;
}

export interface UsePaginationReturn extends PaginationState, PaginationActions {}

export const usePagination = (options: PaginationOptions = {}): UsePaginationReturn => {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalItems: initialTotalItems = 0,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(initialTotalItems);

  const paginationState = useMemo(() => {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      startIndex,
      endIndex,
    };
  }, [currentPage, pageSize, totalItems]);

  const setPage = (page: number) => {
    const { totalPages } = paginationState;
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (paginationState.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (paginationState.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(paginationState.totalPages);
  };

  const handleSetPageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSetTotalItems = (total: number) => {
    setTotalItems(total);
    if (currentPage > Math.ceil(total / pageSize)) {
      setCurrentPage(1);
    }
  };

  const reset = () => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setTotalItems(initialTotalItems);
  };

  return {
    ...paginationState,
    setPage,
    nextPage,
    previousPage,
    setPageSize: handleSetPageSize,
    setTotalItems: handleSetTotalItems,
    goToFirstPage,
    goToLastPage,
    reset,
  };
};

export default usePagination;