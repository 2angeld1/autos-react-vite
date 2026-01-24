import React from 'react';
import { 
  Folder, File as FileIcon, Image as ImageIcon, FileText, Check, 
  Eye, Edit, Move, Trash2, Loader2 
} from 'lucide-react';
import { filesService } from '@/services/files';
import { FileItem } from '@/types/file';
import { formatRelativeTime } from '@/utils/formatters';

interface FileViewProps {
  files: FileItem[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  selectedFiles: string[];
  selectionMode: 'single' | 'multiple' | 'none';
  onFileClick: (file: FileItem) => void;
  onPreview: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onMove: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
}

const FileView: React.FC<FileViewProps> = ({
  files,
  loading,
  viewMode,
  selectedFiles,
  selectionMode,
  onFileClick,
  onPreview,
  onRename,
  onMove,
  onDelete
}) => {

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-12 h-12 text-yellow-500" />;
    }
    if (filesService.isImage(file)) {
      return <ImageIcon className="w-12 h-12 text-blue-500" />;
    }
    if (filesService.isPdf(file)) {
      return <FileText className="w-12 h-12 text-red-500" />;
    }
    return <FileIcon className="w-12 h-12 text-gray-500" />;
  };

  const getSmallFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return <Folder className="w-10 h-10 text-yellow-500" />;
    if (filesService.isImage(file)) return <ImageIcon className="w-10 h-10 text-blue-500" />;
    if (filesService.isPdf(file)) return <FileText className="w-10 h-10 text-red-500" />;
    return <FileIcon className="w-10 h-10 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Folder className="w-16 h-16 mb-4 text-gray-300" />
        <p className="text-lg font-medium">This folder is empty</p>
        <p className="text-sm">Upload files or create a new folder to get started</p>
      </div>
    );
  }

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {files.map(file => (
          <div
            key={file.id}
            onClick={() => onFileClick(file)}
            className={`relative group p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              selectedFiles.includes(file.id) ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-primary-300 bg-white'
            }`}
          >
            {/* Checkbox */}
            {selectionMode !== 'none' && file.type !== 'folder' && (
              <div className="absolute top-2 left-2 z-10">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  selectedFiles.includes(file.id) ? 'bg-primary-500 border-primary-500' : 'border-gray-300 bg-white/80'
                }`}>
                  {selectedFiles.includes(file.id) && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            )}

            {/* Preview/Icon */}
            <div className="flex flex-col items-center mb-2">
              <div className="w-full aspect-square flex items-center justify-center mb-2 overflow-hidden rounded bg-gray-50">
                {file.type === 'file' && filesService.isImage(file) && file.url ? (
                  <img
                    src={filesService.getFileUrl(file)}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="transform transition-transform group-hover:scale-110">
                    {getFileIcon(file)}
                  </div>
                )}
              </div>
              
              <p className="text-sm text-center truncate w-full font-medium text-gray-700 group-hover:text-primary-700" title={file.name}>
                {file.name}
              </p>
              
              {file.type === 'file' && (
                <p className="text-xs text-gray-400 mt-1">
                  {filesService.formatSize(file.size)}
                </p>
              )}
            </div>

            {/* Hover Actions */}
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm">
              {file.type === 'file' && (
                <button
                  onClick={(e) => { e.stopPropagation(); onPreview(file); }}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary-600"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onRename(file); }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-blue-600"
                title="Rename"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onMove(file); }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-orange-600"
                title="Move"
              >
                <Move className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(file); }}
                className="p-1.5 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List View
  return (
    <div className="p-4 space-y-1">
      {files.map(file => (
        <div
          key={file.id}
          onClick={() => onFileClick(file)}
          className={`group flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all border ${
            selectedFiles.includes(file.id) ? 'bg-primary-50 border-primary-200' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
          }`}
        >
          {selectionMode !== 'none' && file.type !== 'folder' && (
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
              selectedFiles.includes(file.id) ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
            }`}>
              {selectedFiles.includes(file.id) && <Check className="w-3 h-3 text-white" />}
            </div>
          )}
          
          <div className="flex-shrink-0">
            {file.type === 'file' && filesService.isImage(file) && file.url ? (
              <img
                src={filesService.getFileUrl(file)}
                alt={file.name}
                className="w-10 h-10 object-cover rounded shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center">
                {getSmallFileIcon(file)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-gray-900 group-hover:text-primary-700">{file.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{file.type === 'folder' ? 'Folder' : filesService.formatSize(file.size)}</span>
              <span>•</span>
              <span>{formatRelativeTime(file.createdAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {file.type === 'file' && (
              <button
                onClick={(e) => { e.stopPropagation(); onPreview(file); }}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-primary-600"
                title="Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onRename(file); }}
              className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-blue-600"
              title="Rename"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMove(file); }}
              className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-orange-600"
              title="Move"
            >
              <Move className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(file); }}
              className="p-2 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-500"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileView;
