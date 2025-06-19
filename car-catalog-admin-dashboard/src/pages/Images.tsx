import React, { useState, useEffect } from 'react';
import { Plus, Upload, Download, Trash2, Settings, Filter } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import { ImageUpload, ImageGallery, ImageItem } from '@/components/images';
import { usePagination } from '@/hooks/usePagination';
import { formatNumber } from '@/utils/formatters';
import toast from 'react-hot-toast';

interface ImageStats {
  total: number;
  totalSize: number;
  byType: Record<string, number>;
  recentUploads: number;
}

const Images: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState<ImageStats>({
    total: 0,
    totalSize: 0,
    byType: {},
    recentUploads: 0,
  });

  const pagination = usePagination({
    initialPageSize: 24,
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockImages: ImageItem[] = [
        {
          id: '1',
          name: 'car-sedan-1.jpg',
          url: 'https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Sedan+1',
          thumbnail: 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=Sedan+1',
          size: 1024 * 500, // 500KB
          type: 'image/jpeg',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          alt: 'Blue sedan car',
          tags: ['sedan', 'blue', 'car'],
        },
        {
          id: '2',
          name: 'car-suv-1.jpg',
          url: 'https://via.placeholder.com/800x600/10B981/FFFFFF?text=SUV+1',
          thumbnail: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=SUV+1',
          size: 1024 * 750, // 750KB
          type: 'image/jpeg',
          createdAt: '2024-01-14T14:30:00Z',
          updatedAt: '2024-01-14T14:30:00Z',
          alt: 'Green SUV car',
          tags: ['suv', 'green', 'car'],
        },
        {
          id: '3',
          name: 'car-sports-1.jpg',
          url: 'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Sports+1',
          thumbnail: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=Sports+1',
          size: 1024 * 600, // 600KB
          type: 'image/jpeg',
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
          alt: 'Yellow sports car',
          tags: ['sports', 'yellow', 'car'],
        },
        // Add more mock images...
      ];

      setImages(mockImages);
      pagination.setTotalItems(mockImages.length);

      // Calculate stats
      const totalSize = mockImages.reduce((sum, img) => sum + img.size, 0);
      const byType = mockImages.reduce((acc, img) => {
        acc[img.type] = (acc[img.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        total: mockImages.length,
        totalSize,
        byType,
        recentUploads: mockImages.filter(img => 
          new Date(img.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
      });

    } catch (error) {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new image entries
      const newImages: ImageItem[] = files.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        alt: file.name,
        tags: [],
      }));

      setImages(prev => [...newImages, ...prev]);
      toast.success(`${files.length} image(s) uploaded successfully`);
      setShowUploadModal(false);

    } catch (error) {
      throw new Error('Upload failed');
    }
  };

  const handleImageDelete = async (ids: string[]) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setImages(prev => prev.filter(img => !ids.includes(img.id)));
      setSelectedImages([]);
      toast.success(`${ids.length} image(s) deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete images');
    }
  };

  const handleImageDownload = (image: ImageItem) => {
    // Create download link
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started');
  };

  const handleBulkDownload = () => {
    const selectedImageObjects = images.filter(img => selectedImages.includes(img.id));
    selectedImageObjects.forEach(img => handleImageDownload(img));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Images</h1>
          <p className="mt-2 text-gray-600">
            Manage and organize your car images
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            icon={<Settings className="h-4 w-4" />}
          >
            Settings
          </Button>
          
          <Button
            onClick={() => setShowUploadModal(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Upload Images
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.total)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatFileSize(stats.totalSize)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Filter className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">JPEG Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.byType['image/jpeg'] || 0)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Uploads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.recentUploads)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Bar */}
      {selectedImages.length > 0 && (
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedImages.length} image(s) selected
              </p>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDownload}
                  icon={<Download className="h-4 w-4" />}
                >
                  Download
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageDelete(selectedImages)}
                  icon={<Trash2 className="h-4 w-4" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Image Gallery */}
      <Card>
        <div className="p-6">
          <ImageGallery
            images={images}
            loading={loading}
            viewMode={viewMode}
            selectedImages={selectedImages}
            onImageSelect={setSelectedImages}
            onImageDelete={handleImageDelete}
            onImageDownload={handleImageDownload}
            allowMultiSelect={true}
            allowEdit={true}
            allowDelete={true}
          />
        </div>
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Images"
        size="lg"
      >
        <div className="p-6">
          <ImageUpload
            onUpload={handleImageUpload}
            maxFiles={10}
            multiple={true}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Images;