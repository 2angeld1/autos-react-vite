import { Router } from 'express';
import { InventoryController } from '@/controllers/inventoryController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/temp/' });

// --- PUBLIC ROUTES ---
router.get('/brands', InventoryController.getAllBrands);
router.get('/categories', InventoryController.getAllCategories);
router.get('/accessories', InventoryController.getAllAccessories);

// --- PRIVATE ADMIN ROUTES ---
router.use(authenticateToken);
router.use(requireAdmin);

// Brands
router.post('/brands', upload.single('logo'), InventoryController.createBrand);
router.put('/brands/:id', upload.single('logo'), InventoryController.updateBrand);
router.delete('/brands/:id', InventoryController.deleteBrand);

// Categories
router.post('/categories', upload.single('image'), InventoryController.createCategory);
router.put('/categories/:id', upload.single('image'), InventoryController.updateCategory);
router.delete('/categories/:id', InventoryController.deleteCategory);

// Accessories
router.post('/accessories', upload.single('image'), InventoryController.createAccessory);
router.put('/accessories/:id', upload.single('image'), InventoryController.updateAccessory);
router.delete('/accessories/:id', InventoryController.deleteAccessory);

export default router;
