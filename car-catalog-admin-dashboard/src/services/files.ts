import { api } from './api';
import type {
  FileItem,
  FolderTreeItem,
  FileListResponse,
  ImageListResponse,
  FileStats,
  CreateFolderData,
  UpdateFileData,
  MoveFileData,
  FileQueryParams,
} from '@/types/file';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class FilesService {
  private readonly baseUrl = '/files';

  /**
   * Get files and folders in a directory
   */
  async getFiles(params?: FileQueryParams): Promise<FileListResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.parentFolder !== undefined) {
        queryParams.append('parentFolder', params.parentFolder || 'root');
      }
      if (params.type) queryParams.append('type', params.type);
      if (params.mimeType) queryParams.append('mimeType', params.mimeType);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.sort) queryParams.append('sort', params.sort);
    }

    const response = await api.get<ApiResponse<FileListResponse>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );
    return response.data.data;
  }

  /**
   * Get folder tree structure
   */
  async getFolderTree(): Promise<FolderTreeItem[]> {
    const response = await api.get<ApiResponse<FolderTreeItem[]>>(`${this.baseUrl}/tree`);
    return response.data.data;
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<FileStats> {
    const response = await api.get<ApiResponse<FileStats>>(`${this.baseUrl}/stats`);
    return response.data.data;
  }

  /**
   * Get only images (for image picker)
   */
  async getImages(params?: { 
    parentFolder?: string | null; 
    search?: string; 
    page?: number; 
    limit?: number 
  }): Promise<ImageListResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.parentFolder) queryParams.append('parentFolder', params.parentFolder);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
    }

    const response = await api.get<ApiResponse<ImageListResponse>>(
      `${this.baseUrl}/images?${queryParams.toString()}`
    );
    return response.data.data;
  }

  /**
   * Get single file/folder by ID
   */
  async getFileById(id: string): Promise<FileItem> {
    const response = await api.get<ApiResponse<FileItem>>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  /**
   * Create a new folder
   */
  async createFolder(data: CreateFolderData): Promise<FileItem> {
    const response = await api.post<ApiResponse<FileItem>>(`${this.baseUrl}/folder`, data);
    return response.data.data;
  }

  /**
   * Upload files
   */
  async uploadFiles(files: File[], parentFolder?: string | null): Promise<FileItem[]> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (parentFolder) {
      formData.append('parentFolder', parentFolder);
    }

    const response = await api.post<ApiResponse<FileItem[]>>(
      `${this.baseUrl}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  /**
   * Update file/folder
   */
  async updateFile(id: string, data: UpdateFileData): Promise<FileItem> {
    const response = await api.put<ApiResponse<FileItem>>(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  /**
   * Move file/folder to another folder
   */
  async moveFile(id: string, data: MoveFileData): Promise<FileItem> {
    const response = await api.put<ApiResponse<FileItem>>(`${this.baseUrl}/${id}/move`, data);
    return response.data.data;
  }

  /**
   * Delete file/folder
   */
  async deleteFile(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Get file URL with base path
   */
  getFileUrl(file: FileItem): string {
    if (!file.url) return '';
    
    // If URL is already absolute, return it
    if (file.url.startsWith('http')) {
      return file.url;
    }
    
    // Otherwise, prepend the API base URL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}${file.url}`;
  }

  /**
   * Check if file is an image
   */
  isImage(file: FileItem): boolean {
    return file.type === 'file' && (file.mimeType?.startsWith('image/') ?? false);
  }

  /**
   * Check if file is a PDF
   */
  isPdf(file: FileItem): boolean {
    return file.type === 'file' && file.mimeType === 'application/pdf';
  }

  /**
   * Format file size
   */
  formatSize(bytes?: number): string {
    if (!bytes) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}

export const filesService = new FilesService();
export default filesService;
