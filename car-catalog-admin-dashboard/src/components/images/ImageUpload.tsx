import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import Button from '@/components/common/Button';
import { validateImageFile } from '@/utils/helpers';
import { formatFileSize } from '@/utils/formatters';

export interface ImageUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

interface UploadingFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  multiple = true,
  className = '',
  disabled = false,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return;

    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    acceptedFiles.forEach(file => {
      const validation = validateImageFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      // Handle validation errors
      console.error('File validation errors:', errors);
      return;
    }

    // Check max files limit
    if (validFiles.length > maxFiles) {
      console.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Create uploading file objects
    const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      progress: 0,
      status: 'uploading',
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    try {
      // Simulate upload progress (replace with actual upload logic)
      for (const uploadingFile of newUploadingFiles) {
        // Update progress
        const interval = setInterval(() => {
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadingFile.id 
                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                : f
            )
          );
        }, 200);

        // Clear interval after upload
        setTimeout(() => clearInterval(interval), 2000);
      }

      // Perform actual upload
      await onUpload(validFiles);

      // Mark all as successful
      setUploadingFiles(prev => 
        prev.map(f => 
          newUploadingFiles.some(nf => nf.id === f.id)
            ? { ...f, progress: 100, status: 'success' }
            : f
        )
      );

      // Remove successful uploads after delay
      setTimeout(() => {
        setUploadingFiles(prev => 
          prev.filter(f => !newUploadingFiles.some(nf => nf.id === f.id))
        );
      }, 2000);

    } catch (error: any) {
      // Mark as error
      setUploadingFiles(prev => 
        prev.map(f => 
          newUploadingFiles.some(nf => nf.id === f.id)
            ? { ...f, status: 'error', error: error.message }
            : f
        )
      );
    }
  }, [onUpload, maxFiles, disabled]);

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple,
    maxSize,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getProgressBarColor = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-600';
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dropzoneActive || isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto h-16 w-16 text-gray-400">
            <ImageIcon className="h-full w-full" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {dropzoneActive ? 'Drop images here' : 'Upload images'}
            </p>
            <p className="text-sm text-gray-600">
              Drag and drop images here, or click to select files
            </p>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>Supported formats: {acceptedTypes.join(', ')}</p>
            <p>Maximum file size: {formatFileSize(maxSize)}</p>
            <p>Maximum files: {maxFiles}</p>
          </div>
          
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={disabled}
          >
            Select Files
          </Button>
        </div>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            Uploading Files ({uploadingFiles.length})
          </h4>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {uploadingFiles.map(uploadingFile => (
              <div
                key={uploadingFile.id}
                className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md"
              >
                {/* File icon and info */}
                <div className="flex-shrink-0">
                  {getStatusIcon(uploadingFile.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadingFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadingFile.file.size)}
                  </p>
                  
                  {/* Progress bar */}
                  {uploadingFile.status === 'uploading' && (
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all ${getProgressBarColor(uploadingFile.status)}`}
                        style={{ width: `${uploadingFile.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Error message */}
                  {uploadingFile.status === 'error' && uploadingFile.error && (
                    <p className="text-xs text-red-600 mt-1">
                      {uploadingFile.error}
                    </p>
                  )}
                </div>
                
                {/* Remove button */}
                <button
                  onClick={() => removeUploadingFile(uploadingFile.id)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;