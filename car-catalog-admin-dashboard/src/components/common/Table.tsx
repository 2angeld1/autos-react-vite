import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T) => string);
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onRowClick?: (record: T, index: number) => void;
  rowActions?: (record: T, index: number) => React.ReactNode;
  emptyText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  rowKey = 'id',
  onSort,
  sortKey,
  sortDirection,
  onRowClick,
  rowActions,
  emptyText = 'No data available',
  className,
  size = 'md',
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey as string]?.toString() || index.toString();
  };

  const getValue = (record: T, key: string): any => {
    return key.split('.').reduce((obj, k) => obj?.[k], record);
  };

  const handleSort = (key: string) => {
    if (!onSort) return;

    const newDirection =
      sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  const tableClasses = clsx(
    'min-w-full divide-y divide-gray-200 bg-white',
    className
  );

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  };

  const cellPaddingClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 border-t border-gray-200"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className={tableClasses}>
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={clsx(
                    cellPaddingClasses[size],
                    'text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer hover:bg-gray-100',
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={clsx(
                            'h-3 w-3',
                            sortKey === column.key && sortDirection === 'asc'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          )}
                        />
                        <ChevronDown
                          className={clsx(
                            'h-3 w-3 -mt-1',
                            sortKey === column.key && sortDirection === 'desc'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {rowActions && (
                <th className={clsx(cellPaddingClasses[size], 'text-right text-xs font-medium text-gray-500 uppercase tracking-wider')}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className={clsx(
                    cellPaddingClasses[size],
                    'text-center text-gray-500',
                    sizeClasses[size]
                  )}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={getRowKey(record, index)}
                  className={clsx('hover:bg-gray-50', {
                    'cursor-pointer': onRowClick,
                  })}
                  onClick={() => onRowClick?.(record, index)}
                >
                  {columns.map((column) => {
                    const value = getValue(record, column.key as string);
                    const content = column.render
                      ? column.render(value, record, index)
                      : value;

                    return (
                      <td
                        key={column.key as string}
                        className={clsx(
                          cellPaddingClasses[size],
                          'whitespace-nowrap',
                          sizeClasses[size],
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          column.className
                        )}
                      >
                        {content}
                      </td>
                    );
                  })}
                  {rowActions && (
                    <td
                      className={clsx(
                        cellPaddingClasses[size],
                        'whitespace-nowrap text-right',
                        sizeClasses[size]
                      )}
                    >
                      {rowActions(record, index)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;