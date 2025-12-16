import React, { useState, useEffect } from 'react';
import { Image, Folder, FileText, HardDrive, Clock } from 'lucide-react';
import Card from '@/components/common/Card';
import { FileExplorer } from '@/components/files';
import { filesService } from '@/services/files';
import type { FileStats } from '@/types/file';
import { formatNumber } from '@/utils/formatters';

const Images: React.FC = () => {
  const [stats, setStats] = useState<FileStats>({
    totalFiles: 0,
    totalFolders: 0,
    totalSize: 0,
    byMimeType: {},
    recentFiles: []
  });
  const [, setLoadingStats] = useState(true);

  const fetchStats = React.useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await filesService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Count images from mimeType
  const imageCount = Object.entries(stats.byMimeType)
    .filter(([key]) => key.startsWith('image/'))
    .reduce((sum, [, count]) => sum + count, 0);

  // Count PDFs
  const pdfCount = stats.byMimeType['application/pdf'] || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
          <p className="mt-2 text-gray-600">
            Manage your images, PDFs and folders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Image className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Images</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatNumber(imageCount)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">PDFs</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatNumber(pdfCount)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Folder className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Folders</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatNumber(stats.totalFolders)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 bg-green-100 rounded-lg">
                  <HardDrive className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Storage</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatFileSize(stats.totalSize)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Total Files</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatNumber(stats.totalFiles)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* File Explorer */}
      <FileExplorer 
        selectionMode="none"
        filterType="all"
        onFilesChanged={fetchStats}
      />
    </div>
  );
};

export default Images;
