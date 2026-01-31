import React, { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  preview?: string | null;
  onRemove?: () => void;
  onLibraryClick?: () => void;
  description?: string;
  libraryButtonText?: string;
}

const Dropzone: React.FC<DropzoneProps> = ({
  onFilesDrop,
  accept = 'image/*',
  multiple = false,
  className = '',
  preview = null,
  onRemove,
  onLibraryClick,
  description = 'Click or drag and drop to upload',
  libraryButtonText = 'Seleccionar del Gestor'
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (!multiple) {
        onFilesDrop([files[0]]);
      } else {
        onFilesDrop(files);
      }
    }
  }, [multiple, onFilesDrop]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesDrop(files);
    }
    // Reset value to allow selecting same file again
    if (e.target) e.target.value = '';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-6 transition-all group
        flex flex-col items-center justify-center text-center
        ${isDragging 
          ? 'border-orange-500 bg-orange-50 scale-[1.01]' 
          : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      {/* 
        Native Input Overlay - THE FIX 
        Covers the entire area, receives click and generic drop events natively if supported,
        but we also keep the div drop handlers for visual feedback (isDragging).
      */}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        title=""
      />

      {/* Visual Content - Below Input */}
      <div className="pointer-events-none w-full h-full flex flex-col items-center justify-center relative z-0">
        {preview ? (
          <div className="relative w-full flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-auto max-w-full object-contain rounded-lg border border-gray-100 shadow-sm"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <div className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded">
                Soltar o clic para cambiar
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500 italic">Haz clic o arrastra una nueva imagen para cambiarla</p>
          </div>
        ) : (
          <>
            <div className="bg-orange-100 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Upload className={`h-6 w-6 ${isDragging ? 'text-orange-600' : 'text-orange-500'}`} />
            </div>
            <p className="text-sm font-medium text-gray-700">{description}</p>
          </>
        )}

        {!preview && <p className="text-xs text-gray-400 mt-4">PNG, JPG, WEBP hasta 10MB</p>}
      </div>

      {/* Interactive Buttons - Above Input (z-20) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20">
        {/* Delete Button */}
        {preview && onRemove && (
          <div className="absolute top-2 right-2 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-transform hover:scale-105"
              title="Eliminar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Library Button */}
        {onLibraryClick && !preview && (
          <div className="absolute bottom-6 pointer-events-auto">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400">o</span>
              <button
                type="button"
                onClick={(e) => {
                      e.preventDefault(); 
                      e.stopPropagation();
                      onLibraryClick();
                    }}
                className="px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-orange-400 transition-colors shadow-sm cursor-pointer"
              >
                {libraryButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropzone;
