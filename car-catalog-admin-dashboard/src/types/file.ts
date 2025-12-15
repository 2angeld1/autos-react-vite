// File Manager Types

export interface FileItem {
  id: string;
  _id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size?: number;
  path: string;
  parentFolder?: string | null;
  url?: string;
  thumbnail?: string;
  tags?: string[];
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FolderTreeItem {
  id: string;
  name: string;
  path: string;
  children: FolderTreeItem[];
}

export interface Breadcrumb {
  id: string;
  name: string;
}

export interface FileListResponse {
  files: FileItem[];
  breadcrumbs: Breadcrumb[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ImageListResponse {
  images: FileItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FileStats {
  totalFiles: number;
  totalFolders: number;
  totalSize: number;
  byMimeType: Record<string, number>;
  recentFiles: FileItem[];
}

export interface CreateFolderData {
  name: string;
  parentFolder?: string | null;
  description?: string;
}

export interface UpdateFileData {
  name?: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface MoveFileData {
  targetFolder: string | null;
}

export interface FileQueryParams {
  parentFolder?: string | null;
  type?: 'file' | 'folder';
  mimeType?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
