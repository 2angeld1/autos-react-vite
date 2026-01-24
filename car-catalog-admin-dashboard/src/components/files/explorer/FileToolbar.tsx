import React from 'react';
import { Upload, FolderPlus, Search, Grid, List } from 'lucide-react';
import Button from '@/components/common/Button';

interface FileToolbarProps {
  onUpload: () => void;
  onNewFolder: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const FileToolbar: React.FC<FileToolbarProps> = ({
  onUpload,
  onNewFolder,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="border-b p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Upload className="w-4 h-4" />}
            onClick={onUpload}
          >
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<FolderPlus className="w-4 h-4" />}
            onClick={onNewFolder}
          >
            New Folder
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all focus:w-72"
            />
          </div>
          
          <div className="flex border rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50 text-gray-600'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50 text-gray-600'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileToolbar;
