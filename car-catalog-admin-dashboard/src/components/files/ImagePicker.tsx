import React, { useState, useEffect, useCallback } from 'react';
import {
  Folder,
  Image,
  Search,
  ChevronRight,
  Home,
  Check,
  Loader2,
  X
} from 'lucide-react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { filesService } from '@/services/files';
import type { FileItem, Breadcrumb } from '@/types/file';

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: FileItem) => void;
  currentImage?: string | null;
  title?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Image'
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<FileItem | null>(null);

  // Fetch files
  const fetchFiles = useCallback(async () => {
    if (!isOpen) return;
    
    setLoading(true);
    try {
      const response = await filesService.getFiles({
        parentFolder: currentFolder,
        search: searchQuery || undefined
      });
      
      // Filter to show only folders and images
      const filteredFiles = response.files.filter(
        file => file.type === 'folder' || filesService.isImage(file)
      );
      
      setFiles(filteredFiles);
      setBreadcrumbs(response.breadcrumbs);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  }, [currentFolder, searchQuery, isOpen]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentFolder(null);
      setSelectedImage(null);
      setSearchQuery('');
    }
  }, [isOpen]);

  // Navigate to folder
  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    setSelectedImage(null);
  };

  // Handle file click
  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file.id);
    } else {
      setSelectedImage(file);
    }
  };

  // Handle selection confirm
  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <div className="flex flex-col h-[70vh]">
        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 mb-4 text-sm flex-wrap">
          <button
            onClick={() => navigateToFolder(null)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-gray-600"
          >
            <Home className="w-4 h-4" />
            <span>Root</span>
          </button>
          
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => navigateToFolder(crumb.id)}
                className={`px-2 py-1 rounded hover:bg-gray-100 ${
                  index === breadcrumbs.length - 1 ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* File Grid */}
        <div className="flex-1 overflow-y-auto border rounded-lg p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Image className="w-16 h-16 mb-4 text-gray-300" />
              <p>No images found</p>
              <p className="text-sm">Upload images in the file manager first</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {files.map(file => (
                <button
                  key={file.id}
                  onClick={() => handleFileClick(file)}
                  className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all hover:shadow-md ${
                    selectedImage?.id === file.id 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {file.type === 'folder' ? (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                      <Folder className="w-10 h-10 text-yellow-500" />
                      <span className="text-xs mt-1 px-1 truncate w-full text-center">
                        {file.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <img
                        src={filesService.getFileUrl(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage?.id === file.id && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="bg-blue-500 rounded-full p-1">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected image preview */}
        {selectedImage && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-4">
            <img
              src={filesService.getFileUrl(selectedImage)}
              alt={selectedImage.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedImage.name}</p>
              <p className="text-sm text-gray-500">
                {filesService.formatSize(selectedImage.size)}
              </p>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedImage}
          >
            Select Image
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImagePicker;
