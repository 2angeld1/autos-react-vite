import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  Download, 
  Trash2, 
  Eye, 
  Edit, 
  MoreVertical,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move
} from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import { formatFileSize, formatRelativeTime } from '@/utils/formatters';

export interface ImageItem {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  size: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  alt?: string;
  tags?: string[];
}

export interface ImageGalleryProps {
  images: ImageItem[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  selectedImages?: string[];
  onImageSelect?: (ids: string[]) => void;
  onImageView?: (image: ImageItem) => void;
  onImageEdit?: (image: ImageItem) => void;
  onImageDelete?: (ids: string[]) => void;
  onImageDownload?: (image: ImageItem) => void;
  allowMultiSelect?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  loading = false,
  viewMode = 'grid',
  selectedImages = [],
  onImageSelect,
  onImageView,
  onImageEdit,
  onImageDelete,
  onImageDownload,
  allowMultiSelect = true,
  allowEdit = true,
  allowDelete = true,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [viewerImage, setViewerImage] = useState<ImageItem | null>(null);
  const [imageViewerScale, setImageViewerScale] = useState(1);
  const [imageViewerRotation, setImageViewerRotation] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Filter images based on search query
  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleImageClick = (image: ImageItem, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd
      if (allowMultiSelect && onImageSelect) {
        const newSelection = selectedImages.includes(image.id)
          ? selectedImages.filter(id => id !== image.id)
          : [...selectedImages, image.id];
        onImageSelect(newSelection);
      }
    } else {
      // Single select or view
      if (onImageView) {
        openImageViewer(image);
      } else if (onImageSelect) {
        onImageSelect([image.id]);
      }
    }
  };

  const openImageViewer = (image: ImageItem) => {
    setViewerImage(image);
    setImageViewerScale(1);
    setImageViewerRotation(0);
    setShowImageViewer(true);
  };

  const closeImageViewer = () => {
    setShowImageViewer(false);
    setViewerImage(null);
  };

  const handleImageViewerZoom = (direction: 'in' | 'out') => {
    setImageViewerScale(prev => {
      if (direction === 'in') {
        return Math.min(prev * 1.2, 5);
      } else {
        return Math.max(prev / 1.2, 0.1);
      }
    });
  };

  const handleImageViewerRotate = () => {
    setImageViewerRotation(prev => (prev + 90) % 360);
  };

  const handleSelectAll = () => {
    if (onImageSelect) {
      const allIds = filteredImages.map(img => img.id);
      onImageSelect(selectedImages.length === allIds.length ? [] : allIds);
    }
  };

  const handleBulkDelete = () => {
    if (onImageDelete && selectedImages.length > 0) {
      onImageDelete(selectedImages);
    }
  };

  const isSelected = (imageId: string) => selectedImages.includes(imageId);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          {selectedImages.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedImages.length} selected
              </span>
              
              {allowDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  icon={<Trash2 className="h-4 w-4" />}
                >
                  Delete
                </Button>
              )}
            </>
          )}

          {allowMultiSelect && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedImages.length === filteredImages.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}

          <div className="flex rounded-md border border-gray-300">
            <button
              onClick={() => setCurrentViewMode('grid')}
              className={`p-2 ${
                currentViewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentViewMode('list')}
              className={`p-2 ${
                currentViewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Images Grid/List */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 mx-auto text-gray-400 mb-4">
            <Search className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No images found
          </h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search terms' : 'Upload some images to get started'}
          </p>
        </div>
      ) : currentViewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map(image => (
            <div
              key={image.id}
              className={`
                relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                ${isSelected(image.id) 
                  ? 'border-primary-500 ring-2 ring-primary-200' 
                  : 'border-transparent hover:border-gray-300'
                }
              `}
              onClick={(e) => handleImageClick(image, e)}
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={image.thumbnail || image.url}
                  alt={image.alt || image.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageViewer(image);
                      }}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {allowEdit && onImageEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onImageEdit(image);
                        }}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-gray-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    
                    {onImageDownload && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onImageDownload(image);
                        }}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-gray-900"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Selection checkbox */}
              {allowMultiSelect && (
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={isSelected(image.id)}
                    onChange={() => {}}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              )}

              {/* Image name */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <p className="text-white text-xs truncate">
                  {image.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
              <div className="col-span-1"></div>
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredImages.map(image => (
              <div
                key={image.id}
                className={`
                  px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer
                  ${isSelected(image.id) ? 'bg-primary-50' : ''}
                `}
                onClick={(e) => handleImageClick(image, e)}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    {allowMultiSelect && (
                      <input
                        type="checkbox"
                        checked={isSelected(image.id)}
                        onChange={() => {}}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    )}
                  </div>
                  
                  <div className="col-span-4 flex items-center space-x-3">
                    <img
                      src={image.thumbnail || image.url}
                      alt={image.alt || image.name}
                      className="h-10 w-10 object-cover rounded"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.name}
                      </p>
                      {image.tags && image.tags.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {image.tags.slice(0, 3).join(', ')}
                          {image.tags.length > 3 && ' +more'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-sm text-gray-600">
                    {formatFileSize(image.size)}
                  </div>
                  
                  <div className="col-span-2 text-sm text-gray-600">
                    {image.type}
                  </div>
                  
                  <div className="col-span-2 text-sm text-gray-600">
                    {formatRelativeTime(image.updatedAt)}
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openImageViewer(image);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {onImageDownload && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onImageDownload(image);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      <Modal
        isOpen={showImageViewer}
        onClose={closeImageViewer}
        title=""
        size="xl"
        className="p-0"
      >
        {viewerImage && (
          <div className="relative bg-black">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-75 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{viewerImage.name}</h3>
                  <p className="text-sm text-gray-300">
                    {formatFileSize(viewerImage.size)} • {viewerImage.type}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleImageViewerZoom('out')}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  
                  <span className="text-sm px-2">
                    {Math.round(imageViewerScale * 100)}%
                  </span>
                  
                  <button
                    onClick={() => handleImageViewerZoom('in')}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={handleImageViewerRotate}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                  >
                    <RotateCw className="h-5 w-5" />
                  </button>
                  
                  {onImageDownload && (
                    <button
                      onClick={() => onImageDownload(viewerImage)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                  
                  <button
                    onClick={closeImageViewer}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="flex items-center justify-center min-h-[60vh] p-16">
              <img
                src={viewerImage.url}
                alt={viewerImage.alt || viewerImage.name}
                className="max-w-full max-h-full object-contain transition-transform"
                style={{
                  transform: `scale(${imageViewerScale}) rotate(${imageViewerRotation}deg)`,
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ImageGallery;