import { Router } from 'express';
import { FileController } from '@/controllers/fileController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import { sanitizeInput } from '@/middleware/validation';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { param, body } from 'express-validator';

const router = Router();

// Base upload directory
const uploadDir = path.join(process.cwd(), 'uploads', 'files');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to save to temp directory first
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Always save to base upload dir initially
    // The controller will move the file to the correct subfolder
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow images and PDFs
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Only images and PDFs are accepted.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 20
  }
});

/**
 * @route   GET /api/files
 * @desc    Get all files and folders in a directory
 * @access  Private (Admin)
 */
router.get('/', [
  authenticateToken,
  sanitizeInput
], FileController.getFiles);

/**
 * @route   GET /api/files/tree
 * @desc    Get folder tree structure
 * @access  Private (Admin)
 */
router.get('/tree', [
  authenticateToken
], FileController.getFolderTree);

/**
 * @route   GET /api/files/stats
 * @desc    Get storage statistics
 * @access  Private (Admin)
 */
router.get('/stats', [
  authenticateToken,
  requireAdmin
], FileController.getStats);

/**
 * @route   GET /api/files/images
 * @desc    Get only images (for image picker)
 * @access  Private (Admin)
 */
router.get('/images', [
  authenticateToken
], FileController.getImages);

/**
 * @route   GET /api/files/:id
 * @desc    Get single file/folder by ID
 * @access  Private (Admin)
 */
router.get('/:id', [
  authenticateToken,
  param('id').notEmpty().withMessage('File ID is required')
], FileController.getFileById);

/**
 * @route   POST /api/files/folder
 * @desc    Create a new folder
 * @access  Private (Admin)
 */
router.post('/folder', [
  authenticateToken,
  requireAdmin,
  body('name').trim().notEmpty().withMessage('Folder name is required'),
  body('parentFolder').optional(),
  body('description').optional().trim()
], FileController.createFolder);

/**
 * @route   POST /api/files/upload
 * @desc    Upload files
 * @access  Private (Admin)
 */
router.post('/upload', [
  authenticateToken,
  requireAdmin,
  upload.array('files', 20)
], FileController.uploadFiles);

/**
 * @route   PUT /api/files/:id
 * @desc    Update file/folder
 * @access  Private (Admin)
 */
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  param('id').notEmpty().withMessage('File ID is required')
], FileController.updateFile);

/**
 * @route   PUT /api/files/:id/move
 * @desc    Move file/folder to another folder
 * @access  Private (Admin)
 */
router.put('/:id/move', [
  authenticateToken,
  requireAdmin,
  param('id').notEmpty().withMessage('File ID is required'),
  body('targetFolder').optional()
], FileController.moveFile);

/**
 * @route   DELETE /api/files/:id
 * @desc    Delete file/folder
 * @access  Private (Admin)
 */
router.delete('/:id', [
  authenticateToken,
  requireAdmin,
  param('id').notEmpty().withMessage('File ID is required')
], FileController.deleteFile);

export default router;
