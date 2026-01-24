import React from 'react';
import { useFileExplorer } from '@/hooks/useFileExplorer';
import { FileItem } from '@/types/file';

// Sub-components
import FileToolbar from './explorer/FileToolbar';
import FileBreadcrumbs from './explorer/FileBreadcrumbs';
import FileView from './explorer/FileView';
import FileModals from './explorer/FileModals';

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
  // Use the custom hook to handle ALL logic
  const explorer = useFileExplorer({
    filterType,
    onFileSelect,
    onFilesSelect,
    onFilesChanged,
    selectionMode
  });

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* 1. Toolbar */}
      <FileToolbar
        onUpload={() => explorer.toggleModal('upload', true)}
        onNewFolder={() => explorer.toggleModal('newFolder', true)}
        searchQuery={explorer.searchQuery}
        setSearchQuery={explorer.setSearchQuery}
        viewMode={explorer.viewMode}
        setViewMode={explorer.setViewMode}
      />

      {/* 2. Breadcrumbs */}
      <FileBreadcrumbs
        breadcrumbs={explorer.breadcrumbs}
        onNavigate={explorer.navigateToFolder}
      />

      {/* 3. Main File View (Grid/List) */}
      <div className="p-0 min-h-[400px]">
        <FileView
          files={explorer.files}
          loading={explorer.loading}
          viewMode={explorer.viewMode}
          selectedFiles={explorer.selectedFiles}
          selectionMode={selectionMode}
          onFileClick={explorer.handleFileClick}
          onPreview={(file) => {
            explorer.setPreviewFile(file);
            explorer.toggleModal('preview', true);
          }}
          onRename={(file) => {
            explorer.setEditingFile(file);
            explorer.setRenameValue(file.name);
            explorer.toggleModal('rename', true);
          }}
          onMove={(file) => {
            explorer.setEditingFile(file);
            explorer.fetchFolderTree(); // Fetch tree only when needed
            explorer.toggleModal('move', true);
          }}
          onDelete={explorer.handleDelete}
        />
      </div>

      {/* 4. Modals (Hidden by default) */}
      <FileModals
        modals={explorer.modals}
        toggleModal={explorer.toggleModal}

        // New Folder
        newFolderName={explorer.newFolderName}
        setNewFolderName={explorer.setNewFolderName}
        onCreateFolder={explorer.handleCreateFolder}

        // Upload
        uploadFiles={explorer.uploadFiles}
        setUploadFiles={explorer.setUploadFiles}
        onUpload={explorer.handleUpload}
        uploading={explorer.uploading}

        // Rename
        renameValue={explorer.renameValue}
        setRenameValue={explorer.setRenameValue}
        onRename={explorer.handleRename}
        setEditingFile={explorer.setEditingFile}

        // Move
        folderTree={explorer.folderTree}
        selectedMoveTarget={explorer.selectedMoveTarget}
        setSelectedMoveTarget={explorer.setSelectedMoveTarget}
        onMove={explorer.handleMove}

        // Preview
        previewFile={explorer.previewFile}
        setPreviewFile={explorer.setPreviewFile}
      />
    </div>
  );
};

export default FileExplorer;
