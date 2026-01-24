import React from 'react';
import { X, Loader2, File, Download, Folder, Home } from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Dropzone } from '@/components/common';
import { filesService } from '@/services/files';
import { FileItem, FolderTreeItem, ModalState } from '@/types/file';



interface FileModalsProps {
  // Modal Visibility State
  modals: ModalState;
  toggleModal: (modal: keyof ModalState, value: boolean) => void;

  // New Folder
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  onCreateFolder: () => void;

  // Upload
  uploadFiles: File[];
  setUploadFiles: (files: File[] | ((prev: File[]) => File[])) => void;
  onUpload: () => void;
  uploading: boolean;

  // Rename
  renameValue: string;
  setRenameValue: (value: string) => void;
  onRename: () => void;
  setEditingFile: (file: FileItem | null) => void;

  // Move
  folderTree: FolderTreeItem[];
  selectedMoveTarget: string | null;
  setSelectedMoveTarget: (id: string | null) => void;
  onMove: () => void;

  // Preview
  previewFile: FileItem | null;
  setPreviewFile: (file: FileItem | null) => void;
}

const FileModals: React.FC<FileModalsProps> = ({
  modals,
  toggleModal,
  newFolderName,
  setNewFolderName,
  onCreateFolder,
  uploadFiles,
  setUploadFiles,
  onUpload,
  uploading,
  renameValue,
  setRenameValue,
  onRename,
  setEditingFile,
  folderTree,
  selectedMoveTarget,
  setSelectedMoveTarget,
  onMove,
  previewFile,
  setPreviewFile
}) => {

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
    <>
      {/* Upload Modal */}
      <Modal
        isOpen={modals.upload}
        onClose={() => {
          toggleModal('upload', false);
          setUploadFiles([]);
        }}
        title="Upload Files"
      >
        <div className="space-y-4">
          <Dropzone
            onFilesDrop={(files) => {
              setUploadFiles(prev => [...prev, ...files]);
            }}
            multiple={true}
            accept="image/*,application/pdf"
            description="Haz clic o arrastra archivos aquí para prepararlos para la subida"
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
              toggleModal('upload', false);
              setUploadFiles([]);
            }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onUpload}
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
        isOpen={modals.newFolder}
        onClose={() => {
          toggleModal('newFolder', false);
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
              toggleModal('newFolder', false);
              setNewFolderName('');
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onCreateFolder}>
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={modals.rename}
        onClose={() => {
          toggleModal('rename', false);
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
              toggleModal('rename', false);
              setEditingFile(null);
              setRenameValue('');
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onRename}>
              Rename
            </Button>
          </div>
        </div>
      </Modal>

      {/* Move Modal */}
      <Modal
        isOpen={modals.move}
        onClose={() => {
          toggleModal('move', false);
          setEditingFile(null);
          setSelectedMoveTarget(null);
        }}
        title="Move to"
      >
        <div className="space-y-4">
          <div className="border rounded-lg max-h-64 overflow-y-auto p-2">
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
              toggleModal('move', false);
              setEditingFile(null);
              setSelectedMoveTarget(null);
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onMove}>
              Move
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={modals.preview}
        onClose={() => {
          toggleModal('preview', false);
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
                className="max-w-full max-h-[60vh] mx-auto rounded shadow-sm"
              />
            ) : filesService.isPdf(previewFile) ? (
              <iframe
                src={filesService.getFileUrl(previewFile)}
                className="w-full h-[60vh] rounded border"
                title={previewFile.name}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-50 rounded border border-dashed">
                <File className="w-16 h-16 opacity-50" />
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                <p className="font-medium text-gray-900">{filesService.formatSize(previewFile.size)}</p>
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
    </>
  );
};

export default FileModals;
