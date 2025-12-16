import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Folder,
  File,
  Image,
  FileText,
  Upload,
  FolderPlus,
  Trash2,
  Edit,
  MoreVertical,
  Grid,
  List,
  Search,
  ChevronRight,
  Home,
  Download,
  Eye,
  Move,
  X,
  Check,
  Loader2
} from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import { filesService } from '@/services/files';
import type { FileItem, Breadcrumb, FolderTreeItem } from '@/types/file';
import { formatRelativeTime } from '@/utils/formatters';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface FileExplorerProps {
  onFileSelect?: (file: FileItem) => void;
  onFilesSelect?: (files: FileItem[]) => void;
  onFilesChanged?: () => void;
  selectionMode?: 'single' | 'multiple' | 'none';
  filterType?: 'all' | 'images' | 'pdfs';
  className?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  onFileSelect,
  onFilesSelect,
  onFilesChanged,
  selectionMode = 'none',
  filterType = 'all',
  className = ''
}) => {
  // State
  const [files, setFiles] = useState<FileItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Form state
  const [newFolderName, setNewFolderName] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [folderTree, setFolderTree] = useState<FolderTreeItem[]>([]);
  const [selectedMoveTarget, setSelectedMoveTarget] = useState<string | null>(null);
  
  // Upload state
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch files
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

  // Fetch folder tree for move modal
  const fetchFolderTree = async () => {
    try {
      const tree = await filesService.getFolderTree();
      setFolderTree(tree);
    } catch (error) {
      console.error('Error fetching folder tree:', error);
    }
  };

  // Navigate to folder
  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    setSelectedFiles([]);
  };

  // Handle file click
  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file.id);
    } else if (selectionMode !== 'none') {
      handleFileSelection(file);
    } else {
      // Preview file
      setPreviewFile(file);
      setShowPreviewModal(true);
    }
  };

  // Handle file selection
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

  // Create folder
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
      setShowNewFolderModal(false);
      setNewFolderName('');
      fetchFiles();
      onFilesChanged?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error creating folder');
    }
  };

  // Upload files
  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    try {
      await filesService.uploadFiles(uploadFiles, currentFolder);
      toast.success(`${uploadFiles.length} file(s) uploaded successfully`);
      setShowUploadModal(false);
      setUploadFiles([]);
      fetchFiles();
      onFilesChanged?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  // Rename file
  const handleRename = async () => {
    if (!editingFile || !renameValue.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      await filesService.updateFile(editingFile.id, { name: renameValue.trim() });
      toast.success('Renamed successfully');
      setShowRenameModal(false);
      setEditingFile(null);
      setRenameValue('');
      fetchFiles();
      onFilesChanged?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error renaming');
    }
  };

  // Delete file
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

  // Move file
  const handleMove = async () => {
    if (!editingFile) return;

    try {
      await filesService.moveFile(editingFile.id, { targetFolder: selectedMoveTarget });
      toast.success('Moved successfully');
      setShowMoveModal(false);
      setEditingFile(null);
      setSelectedMoveTarget(null);
      fetchFiles();
      onFilesChanged?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error moving');
    }
  };

  // Get file icon
  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-12 h-12 text-yellow-500" />;
    }
    if (filesService.isImage(file)) {
      return <Image className="w-12 h-12 text-blue-500" />;
    }
    if (filesService.isPdf(file)) {
      return <FileText className="w-12 h-12 text-red-500" />;
    }
    return <File className="w-12 h-12 text-gray-500" />;
  };

  // Render folder tree recursively
  const renderFolderTree = (items: FolderTreeItem[], level = 0): React.ReactNode => {
    return items.map(item => (
      <div key={item.id}>
        <button
          onClick={() => setSelectedMoveTarget(item.id)}
          className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-100 ${
            selectedMoveTarget === item.id ? 'bg-blue-100 text-blue-700' : ''
          }`}
          style={{ paddingLeft: `${(level * 16) + 12}px` }}
        >
          <Folder className="w-4 h-4 text-yellow-500" />
          <span className="truncate">{item.name}</span>
        </button>
        {item.children.length > 0 && renderFolderTree(item.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Toolbar */}
      <div className="border-b p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => setShowUploadModal(true)}
            >
              Upload
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<FolderPlus className="w-4 h-4" />}
              onClick={() => setShowNewFolderModal(true)}
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
                className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 mt-4 text-sm">
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
      </div>

      {/* File Grid/List */}
      <div className="p-4 min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Folder className="w-16 h-16 mb-4 text-gray-300" />
            <p>This folder is empty</p>
            <p className="text-sm">Upload files or create a new folder</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map(file => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className={`relative group p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedFiles.includes(file.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Selection checkbox */}
                {selectionMode !== 'none' && file.type !== 'folder' && (
                  <div className="absolute top-2 left-2">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedFiles.includes(file.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'
                    }`}>
                      {selectedFiles.includes(file.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                )}

                {/* Actions dropdown */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Show dropdown menu
                      }}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* File preview/icon */}
                <div className="flex flex-col items-center">
                  {file.type === 'file' && filesService.isImage(file) && file.url ? (
                    <img
                      src={filesService.getFileUrl(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="mb-2">{getFileIcon(file)}</div>
                  )}
                  <p className="text-sm text-center truncate w-full" title={file.name}>
                    {file.name}
                  </p>
                  {file.type === 'file' && (
                    <p className="text-xs text-gray-500">
                      {filesService.formatSize(file.size)}
                    </p>
                  )}
                </div>

                {/* Quick actions on hover */}
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-1">
                  {file.type === 'file' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewFile(file);
                        setShowPreviewModal(true);
                      }}
                      className="p-1 bg-white rounded shadow hover:bg-gray-100"
                      title="Preview"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFile(file);
                      setRenameValue(file.name);
                      setShowRenameModal(true);
                    }}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100"
                    title="Rename"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFile(file);
                      fetchFolderTree();
                      setShowMoveModal(true);
                    }}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100"
                    title="Move"
                  >
                    <Move className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file);
                    }}
                    className="p-1 bg-white rounded shadow hover:bg-red-100 text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-1">
            {files.map(file => (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedFiles.includes(file.id) ? 'bg-blue-50' : ''
                }`}
              >
                {selectionMode !== 'none' && file.type !== 'folder' && (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedFiles.includes(file.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                  }`}>
                    {selectedFiles.includes(file.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                )}
                
                <div className="flex-shrink-0">
                  {file.type === 'file' && filesService.isImage(file) && file.url ? (
                    <img
                      src={filesService.getFileUrl(file)}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {file.type === 'folder' ? 'Folder' : filesService.formatSize(file.size)}
                    {' • '}
                    {formatRelativeTime(file.createdAt)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {file.type === 'file' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewFile(file);
                        setShowPreviewModal(true);
                      }}
                      className="p-2 rounded hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFile(file);
                      setRenameValue(file.name);
                      setShowRenameModal(true);
                    }}
                    className="p-2 rounded hover:bg-gray-200"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file);
                    }}
                    className="p-2 rounded hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadFiles([]);
        }}
        title="Upload Files"
      >
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Click to select files or drag and drop</p>
            <p className="text-sm text-gray-400 mt-2">Images and PDFs up to 10MB</p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setUploadFiles(files);
            }}
            className="hidden"
          />

          {uploadFiles.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium">Selected files:</p>
              {uploadFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="truncate">{file.name}</span>
                  <button
                    onClick={() => setUploadFiles(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowUploadModal(false);
              setUploadFiles([]);
            }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={uploadFiles.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                `Upload ${uploadFiles.length} file(s)`
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Folder Modal */}
      <Modal
        isOpen={showNewFolderModal}
        onClose={() => {
          setShowNewFolderModal(false);
          setNewFolderName('');
        }}
        title="Create New Folder"
      >
        <div className="space-y-4">
          <Input
            label="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Enter folder name"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowNewFolderModal(false);
              setNewFolderName('');
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateFolder}>
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setEditingFile(null);
          setRenameValue('');
        }}
        title="Rename"
      >
        <div className="space-y-4">
          <Input
            label="New name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Enter new name"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowRenameModal(false);
              setEditingFile(null);
              setRenameValue('');
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRename}>
              Rename
            </Button>
          </div>
        </div>
      </Modal>

      {/* Move Modal */}
      <Modal
        isOpen={showMoveModal}
        onClose={() => {
          setShowMoveModal(false);
          setEditingFile(null);
          setSelectedMoveTarget(null);
        }}
        title="Move to"
      >
        <div className="space-y-4">
          <div className="border rounded-lg max-h-64 overflow-y-auto">
            <button
              onClick={() => setSelectedMoveTarget(null)}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 hover:bg-gray-100 ${
                selectedMoveTarget === null ? 'bg-blue-100 text-blue-700' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Root</span>
            </button>
            {renderFolderTree(folderTree)}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowMoveModal(false);
              setEditingFile(null);
              setSelectedMoveTarget(null);
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleMove}>
              Move
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewFile(null);
        }}
        title={previewFile?.name || 'Preview'}
        size="lg"
      >
        {previewFile && (
          <div className="space-y-4">
            {filesService.isImage(previewFile) ? (
              <img
                src={filesService.getFileUrl(previewFile)}
                alt={previewFile.name}
                className="max-w-full max-h-[60vh] mx-auto rounded"
              />
            ) : filesService.isPdf(previewFile) ? (
              <iframe
                src={filesService.getFileUrl(previewFile)}
                className="w-full h-[60vh] rounded"
                title={previewFile.name}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <File className="w-16 h-16" />
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                <p>{filesService.formatSize(previewFile.size)}</p>
                <p>{previewFile.mimeType}</p>
              </div>
              <Button
                variant="outline"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  window.open(filesService.getFileUrl(previewFile), '_blank');
                }}
              >
                Download
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FileExplorer;
