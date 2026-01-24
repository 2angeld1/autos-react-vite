import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { Breadcrumb } from '@/types/file';

interface FileBreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  onNavigate: (folderId: string | null) => void;
}

const FileBreadcrumbs: React.FC<FileBreadcrumbsProps> = ({ breadcrumbs, onNavigate }) => {
  return (
    <div className="flex items-center gap-1 px-4 pb-3 -mt-2 text-sm border-b">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Root</span>
      </button>
      
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => onNavigate(crumb.id)}
            className={`px-2 py-1 rounded hover:bg-gray-100 transition-colors max-w-[150px] truncate ${
              index === breadcrumbs.length - 1 ? 'text-primary-600 font-medium' : 'text-gray-600'
            }`}
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default FileBreadcrumbs;
