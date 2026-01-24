import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { filesService } from '@/services/files';
import type { FileItem, Breadcrumb, FolderTreeItem, ModalState } from '@/types/file';

interface UseFileExplorerProps {
  filterType?: 'all' | 'images' | 'pdfs';
  onFileSelect?: (file: FileItem) => void;
  onFilesSelect?: (files: FileItem[]) => void;
  onFilesChanged?: () => void;
  selectionMode?: 'single' | 'multiple' | 'none';
}

export const useFileExplorer = ({
  filterType = 'all',
  onFileSelect,
  onFilesSelect,
  onFilesChanged,
  selectionMode = 'none',
}: UseFileExplorerProps = {}) => {
  // Main State
  const [files, setFiles] = useState<FileItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
  // Modals Visibility
  const [modals, setModals] = useState<ModalState>({
    upload: false,
    newFolder: false,
    rename: false,
    move: false,
    preview: false,
  });

  // Action State
  const [newFolderName, setNewFolderName] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [folderTree, setFolderTree] = useState<FolderTreeItem[]>([]);
  const [selectedMoveTarget, setSelectedMoveTarget] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Helper to toggle modal safety
  const toggleModal = (modal: keyof typeof modals, value: boolean) => {
    setModals(prev => ({ ...prev, [modal]: value }));
  };

  // 1. Fetch Files
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      let mimeType: string | undefined;
      if (filterType === 'images') mimeType = 'image';
      else if (filterType === 'pdfs') mimeType = 'pdf';

      const response = await filesService.getFiles({
        parentFolder: currentFolder,
        mimeType,
        search: searchQuery || undefined
      });
      
      setFiles(response.files);
      setBreadcrumbs(response.breadcrumbs);
    } catch (error) {
      toast.error('Error loading files');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentFolder, searchQuery, filterType]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // 2. Navigation & Selection
  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    setSelectedFiles([]);
  };

  const handleFileSelection = (file: FileItem) => {
    if (file.type === 'folder') return;

    if (selectionMode === 'single') {
      setSelectedFiles([file.id]);
      onFileSelect?.(file);
    } else if (selectionMode === 'multiple') {
      setSelectedFiles(prev => {
        const newSelection = prev.includes(file.id)
          ? prev.filter(id => id !== file.id)
          : [...prev, file.id];
        
        const selectedFileItems = files.filter(f => newSelection.includes(f.id));
        onFilesSelect?.(selectedFileItems);
        
        return newSelection;
      });
    }
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file.id);
    } else if (selectionMode !== 'none') {
      handleFileSelection(file);
    } else {
      setPreviewFile(file);
      toggleModal('preview', true);
    }
  };

  // 3. Actions (Create, Upload, Rename, Move, Delete)
  
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    try {
      await filesService.createFolder({
        name: newFolderName.trim(),
        parentFolder: currentFolder
      });
      
      toast.success('Folder created successfully');
      toggleModal('newFolder', false);
      setNewFolderName('');
      fetchFiles();
      onFilesChanged?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error creating folder');
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    try {
      await filesService.uploadFiles(uploadFiles, currentFolder);
      toast.success(`${uploadFiles.length} file(s) uploaded successfully`);
      toggleModal('upload', false);
      setUploadFiles([]);
      fetchFiles();
      onFilesChanged?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  const handleRename = async () => {
    if (!editingFile || !renameValue.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      await filesService.updateFile(editingFile.id, { name: renameValue.trim() });
      toast.success('Renamed successfully');
      toggleModal('rename', false);
      setEditingFile(null);
      setRenameValue('');
      fetchFiles();
      onFilesChanged?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error renaming');
    }
  };

  const handleDelete = async (file: FileItem) => {
    const result = await Swal.fire({
      title: 'Delete?',
      text: `Are you sure you want to delete "${file.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await filesService.deleteFile(file.id);
        toast.success('Deleted successfully');
        fetchFiles();
        onFilesChanged?.();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error deleting');
      }
    }
  };

  const fetchFolderTree = async () => {
    try {
      const tree = await filesService.getFolderTree();
      setFolderTree(tree);
    } catch (error) {
      console.error('Error fetching folder tree:', error);
    }
  };

  const handleMove = async () => {
    if (!editingFile) return;

    try {
      await filesService.moveFile(editingFile.id, { targetFolder: selectedMoveTarget });
      toast.success('Moved successfully');
      toggleModal('move', false);
      setEditingFile(null);
      setSelectedMoveTarget(null);
      fetchFiles();
      onFilesChanged?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error moving');
    }
  };

  return {
    // State
    files,
    breadcrumbs,
    currentFolder,
    loading,
    viewMode,
    searchQuery,
    selectedFiles,
    modals,
    newFolderName,
    renameValue,
    editingFile,
    previewFile,
    folderTree,
    selectedMoveTarget,
    uploadFiles,
    uploading,
    
    // Setters
    setViewMode,
    setSearchQuery,
    setNewFolderName,
    setRenameValue,
    setEditingFile,
    setPreviewFile,
    setSelectedMoveTarget,
    setUploadFiles,
    setUploading,
    toggleModal,

    // Actions
    navigateToFolder,
    handleFileClick,
    handleCreateFolder,
    handleUpload,
    handleRename,
    handleDelete,
    handleMove,
    fetchFolderTree
  };
};
