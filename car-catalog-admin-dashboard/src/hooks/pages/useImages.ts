import { useState, useEffect, useCallback, useMemo } from 'react';
import { filesService } from '@/services/files';
import type { FileStats } from '@/types/file';

export const useImages = () => {
  const [stats, setStats] = useState<FileStats>({
    totalFiles: 0,
    totalFolders: 0,
    totalSize: 0,
    byMimeType: {},
    recentFiles: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = useCallback(async () => {
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

  const imageCount = useMemo(() => 
    Object.entries(stats.byMimeType)
      .filter(([key]) => key.startsWith('image/'))
      .reduce((sum, [, count]) => sum + count, 0),
    [stats.byMimeType]
  );
  
  const pdfCount = stats.byMimeType['application/pdf'] || 0;

  return {
    state: {
      stats,
      loadingStats,
      imageCount,
      pdfCount,
    },
    actions: {
      fetchStats,
    },
    utils: {
      formatFileSize,
    }
  };
};
