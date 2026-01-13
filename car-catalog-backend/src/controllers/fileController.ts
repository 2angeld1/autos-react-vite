import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import FileItem, { IFileItemDocument } from '@/models/FileItem';
import { logger } from '@/utils/logger';
import { AuthRequest } from '@/middleware/auth';
import { CloudinaryService } from '@/services/cloudinaryService';

// Base upload directory
const BASE_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'files');

// Helper para crear respuesta exitosa
const successResponse = (res: Response, data: any, message?: string) => {
  res.json({
    success: true,
    data,
    message
  });
};

// Helper para crear respuesta de error
const errorResponse = (res: Response, status: number, message: string) => {
  res.status(status).json({
    success: false,
    message
  });
};

// Async handler wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export class FileController {
  /**
   * Get all files and folders in a directory
   */
  static getFiles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { 
      parentFolder = null, 
      type, 
      mimeType, 
      search,
      page = 1,
      limit = 50,
      sort = 'name'
    } = req.query;

    const filters: Record<string, unknown> = {};
    
    // Handle parent folder
    if (parentFolder && parentFolder !== 'null' && parentFolder !== 'root') {
      filters.parentFolder = parentFolder;
    } else {
      filters.parentFolder = null;
    }

    // Filter by type (file/folder)
    if (type) {
      filters.type = type;
    }

    // Filter by mime type (for images, pdfs, etc.)
    if (mimeType) {
      if (mimeType === 'image') {
        filters.mimeType = { $regex: /^image\// };
      } else if (mimeType === 'pdf') {
        filters.mimeType = 'application/pdf';
      } else {
        filters.mimeType = mimeType;
      }
    }

    // Search by name
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    // Sort order
    let sortOrder: Record<string, 1 | -1> = { type: -1, name: 1 }; // Folders first, then alphabetically
    if (sort === '-createdAt') {
      sortOrder = { type: -1, createdAt: -1 };
    } else if (sort === '-size') {
      sortOrder = { type: -1, size: -1 };
    }

    const [files, total] = await Promise.all([
      FileItem.find(filters)
        .sort(sortOrder)
        .skip(skip)
        .limit(limitNum)
        .populate('parentFolder', 'name path'),
      FileItem.countDocuments(filters)
    ]);

    // Get breadcrumb path
    let breadcrumbs: { id: string; name: string }[] = [];
    if (parentFolder && parentFolder !== 'null' && parentFolder !== 'root') {
      breadcrumbs = await FileController.getBreadcrumbs(parentFolder as string);
    }

    successResponse(res, {
      files,
      breadcrumbs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  });

  /**
   * Get breadcrumb path for a folder
   */
  static getBreadcrumbs = async (folderId: string): Promise<{ id: string; name: string }[]> => {
    const breadcrumbs: { id: string; name: string }[] = [];
    let currentFolder = await FileItem.findById(folderId);

    while (currentFolder) {
      breadcrumbs.unshift({
        id: currentFolder._id.toString(),
        name: currentFolder.name
      });
      
      if (currentFolder.parentFolder) {
        currentFolder = await FileItem.findById(currentFolder.parentFolder);
      } else {
        currentFolder = null;
      }
    }

    return breadcrumbs;
  };

  /**
   * Get folder tree structure
   */
  static getFolderTree = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const buildTree = async (parentId: string | null): Promise<any[]> => {
      const folders = await FileItem.find({
        type: 'folder',
        parentFolder: parentId
      }).sort({ name: 1 });

      const tree = [];
      for (const folder of folders) {
        const children = await buildTree(folder._id.toString());
        tree.push({
          id: folder._id.toString(),
          name: folder.name,
          path: folder.path,
          children
        });
      }
      return tree;
    };

    const tree = await buildTree(null);
    successResponse(res, tree);
  });

  /**
   * Create a new folder
   */
  static createFolder = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, parentFolder = null, description } = req.body;

    if (!name || !name.trim()) {
      return errorResponse(res, 400, 'Folder name is required');
    }

    // Validate folder name - keep spaces but remove dangerous characters
    const sanitizedName = name.trim().replace(/[/\\?%*:|"<>]/g, '-');

    // Check if folder already exists in parent
    const existingFolder = await FileItem.findOne({
      name: sanitizedName,
      type: 'folder',
      parentFolder: parentFolder || null
    });

    if (existingFolder) {
      return errorResponse(res, 400, 'A folder with this name already exists');
    }

    // Build path
    let folderPath = `/${sanitizedName}`;
    if (parentFolder) {
      const parent = await FileItem.findById(parentFolder);
      if (parent) {
        folderPath = `${parent.path}/${sanitizedName}`;
      }
    }

    // Create physical folder
    const physicalPath = path.join(BASE_UPLOAD_DIR, ...folderPath.split('/').filter(Boolean));
    if (!fs.existsSync(physicalPath)) {
      fs.mkdirSync(physicalPath, { recursive: true });
    }

    const folder = new FileItem({
      name: sanitizedName,
      type: 'folder',
      path: folderPath,
      parentFolder: parentFolder || null,
      description,
      createdBy: req.user?.id,
      isPublic: true
    });

    await folder.save();

    logger.info(`Folder created: ${folderPath} (physical: ${physicalPath})`);
    successResponse(res, folder, 'Folder created successfully');
  });

  /**
   * Upload files
   */
  static uploadFiles = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { parentFolder = null } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return errorResponse(res, 400, 'No files uploaded');
    }

    // Get parent folder info
    let basePath = '';
    let parentFolderDoc = null;
    if (parentFolder && parentFolder !== 'null' && parentFolder !== 'root') {
      parentFolderDoc = await FileItem.findById(parentFolder);
      if (parentFolderDoc) {
        basePath = parentFolderDoc.path;
      }
    }

    const uploadedFiles: IFileItemDocument[] = [];

    for (const file of files) {
      try {
        // Current file location (in base uploads/files directory)
        const currentPath = file.path;
        
        // Target directory based on parent folder
        const targetDir = basePath 
          ? path.join(BASE_UPLOAD_DIR, ...basePath.split('/').filter(Boolean))
          : BASE_UPLOAD_DIR;
        
        // Ensure target directory exists
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // Target file path
        const targetPath = path.join(targetDir, file.filename);
        
        // Move file if it's not already in the target directory
        if (currentPath !== targetPath) {
          fs.renameSync(currentPath, targetPath);
          logger.info(`File moved from ${currentPath} to ${targetPath}`);
        }

        // --- CLOUDINARY UPLOAD ---
        // Construir la carpeta en Cloudinary basada en el path virtual
        // El usuario pidió que todo esté dentro de "autos"
        const cloudinaryFolder = basePath
          ? `autos${basePath}`
          : 'autos';

        const cloudinaryResult = await CloudinaryService.uploadImage(targetPath, cloudinaryFolder);
        // --- END CLOUDINARY UPLOAD ---

        // Build the virtual path and URL
        const filePath = basePath ? `${basePath}/${file.filename}` : `/${file.filename}`;

        // Usar la URL de Cloudinary si está disponible, de lo contrario local
        const fileUrl = cloudinaryResult.secure_url || `/uploads/files${filePath}`;

        // Generate thumbnail URL for images
        let thumbnailUrl = undefined;
        if (file.mimetype.startsWith('image/')) {
          thumbnailUrl = fileUrl;
        }

        const fileItem = new FileItem({
          name: file.originalname,
          type: 'file',
          mimeType: file.mimetype,
          size: file.size,
          path: filePath,
          parentFolder: parentFolder && parentFolder !== 'null' && parentFolder !== 'root' ? parentFolder : null,
          url: fileUrl,
          thumbnail: thumbnailUrl,
          createdBy: req.user?.id,
          isPublic: true,
          cloudinaryId: cloudinaryResult.public_id,
          cloudinaryUrl: cloudinaryResult.secure_url
        });

        await fileItem.save();
        uploadedFiles.push(fileItem);

        // Delete local file after successful upload to Cloudinary
        if (fs.existsSync(targetPath)) {
          fs.unlinkSync(targetPath);
          logger.info(`Local file deleted after Cloudinary upload: ${targetPath}`);
        }

        logger.info(`File uploaded to Cloudinary: ${file.originalname} -> ${fileUrl}`);
      } catch (error) {
        logger.error(`Error processing file ${file.originalname}:`, error);
        // Clean up the file if it exists
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    if (uploadedFiles.length === 0) {
      return errorResponse(res, 500, 'Failed to upload files');
    }

    successResponse(res, uploadedFiles, `${uploadedFiles.length} file(s) uploaded successfully`);
  });

  /**
   * Get single file/folder by ID
   */
  static getFileById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const file = await FileItem.findById(id).populate('parentFolder', 'name path');

    if (!file) {
      return errorResponse(res, 404, 'File not found');
    }

    successResponse(res, file);
  });

  /**
   * Update file/folder
   */
  static updateFile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description, tags, isPublic } = req.body;

    const file = await FileItem.findById(id);

    if (!file) {
      return errorResponse(res, 404, 'File not found');
    }

    // Update fields
    if (name) {
      const sanitizedName = name.trim().replace(/[/\\?%*:|"<>]/g, '-');
      
      // Check for duplicate name in same folder
      const existingFile = await FileItem.findOne({
        _id: { $ne: id },
        name: sanitizedName,
        type: file.type,
        parentFolder: file.parentFolder
      });

      if (existingFile) {
        return errorResponse(res, 400, `A ${file.type} with this name already exists`);
      }

      file.name = sanitizedName;
      
      // Update path
      const parentPath = file.parentFolder 
        ? (await FileItem.findById(file.parentFolder))?.path || ''
        : '';
      file.path = `${parentPath}/${sanitizedName}`;
    }

    if (description !== undefined) file.description = description;
    if (tags !== undefined) file.tags = tags;
    if (isPublic !== undefined) file.isPublic = isPublic;

    await file.save();

    logger.info(`File updated: ${file.path}`);
    successResponse(res, file, 'File updated successfully');
  });

  /**
   * Delete file/folder
   */
  static deleteFile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const file = await FileItem.findById(id);

    if (!file) {
      return errorResponse(res, 404, 'File not found');
    }

    // If it's a folder, delete all contents recursively
    if (file.type === 'folder') {
      await FileController.deleteFolderContents(file._id.toString());
      
      // Delete physical folder if it exists
      const physicalPath = path.join(BASE_UPLOAD_DIR, ...file.path.split('/').filter(Boolean));
      if (fs.existsSync(physicalPath)) {
        fs.rmSync(physicalPath, { recursive: true, force: true });
      }
    } else {
      // Delete from Cloudinary if info exists
      if (file.cloudinaryId) {
        await CloudinaryService.deleteImage(file.cloudinaryId);
      }

      // Delete physical file if it exists locally
      const physicalPath = path.join(BASE_UPLOAD_DIR, ...file.path.split('/').filter(Boolean));
      if (fs.existsSync(physicalPath)) {
        fs.unlinkSync(physicalPath);
      }
    }

    await FileItem.findByIdAndDelete(id);

    logger.info(`File deleted: ${file.path}`);
    successResponse(res, { id }, 'File deleted successfully');
  });

  /**
   * Delete folder contents recursively
   */
  static deleteFolderContents = async (folderId: string): Promise<void> => {
    const contents = await FileItem.find({ parentFolder: folderId });

    for (const item of contents) {
      if (item.type === 'folder') {
        await FileController.deleteFolderContents(item._id.toString());
      }

      await FileItem.findByIdAndDelete(item._id);
    }
  };

  /**
   * Move file/folder to another folder
   */
  static moveFile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { targetFolder } = req.body;

    const file = await FileItem.findById(id);

    if (!file) {
      return errorResponse(res, 404, 'File not found');
    }

    // Verify target folder exists (if not moving to root)
    let newPath = `/${file.name}`;
    if (targetFolder && targetFolder !== 'null' && targetFolder !== 'root') {
      const target = await FileItem.findById(targetFolder);
      if (!target || target.type !== 'folder') {
        return errorResponse(res, 400, 'Target folder not found');
      }
      newPath = `${target.path}/${file.name}`;
      
      // Prevent moving folder into itself
      if (file.type === 'folder' && target.path.startsWith(file.path)) {
        return errorResponse(res, 400, 'Cannot move folder into itself');
      }
    }

    // Check for duplicate name
    const existingFile = await FileItem.findOne({
      _id: { $ne: id },
      name: file.name,
      type: file.type,
      parentFolder: targetFolder || null
    });

    if (existingFile) {
      return errorResponse(res, 400, `A ${file.type} with this name already exists in the target folder`);
    }

    file.parentFolder = targetFolder && targetFolder !== 'null' && targetFolder !== 'root' 
      ? targetFolder 
      : null;
    file.path = newPath;

    await file.save();

    logger.info(`File moved: ${file.name} -> ${newPath}`);
    successResponse(res, file, 'File moved successfully');
  });

  /**
   * Get storage statistics
   */
  static getStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const [
      totalFiles,
      totalFolders,
      totalSize,
      byMimeType,
      recentFiles
    ] = await Promise.all([
      FileItem.countDocuments({ type: 'file' }),
      FileItem.countDocuments({ type: 'folder' }),
      FileItem.aggregate([
        { $match: { type: 'file' } },
        { $group: { _id: null, total: { $sum: '$size' } } }
      ]),
      FileItem.aggregate([
        { $match: { type: 'file' } },
        { $group: { _id: '$mimeType', count: { $sum: 1 } } }
      ]),
      FileItem.find({ type: 'file' })
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    successResponse(res, {
      totalFiles,
      totalFolders,
      totalSize: totalSize[0]?.total || 0,
      byMimeType: byMimeType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      recentFiles
    });
  });

  /**
   * Get only images (for image picker)
   */
  static getImages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { 
      parentFolder = null, 
      search,
      page = 1,
      limit = 50
    } = req.query;

    const filters: Record<string, unknown> = {
      type: 'file',
      mimeType: { $regex: /^image\// }
    };
    
    if (parentFolder && parentFolder !== 'null' && parentFolder !== 'root') {
      filters.parentFolder = parentFolder;
    } else {
      // Get all images regardless of folder for the picker
      delete filters.parentFolder;
    }

    if (search) {
      filters.name = { $regex: search, $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [images, total] = await Promise.all([
      FileItem.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      FileItem.countDocuments(filters)
    ]);

    successResponse(res, {
      images,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  });
}
