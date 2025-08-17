import express from  'express';
const router = express.Router();
import {getAllEquipment,getEquipmentStats,createEquipment,updateEquipmentStatus} from '../controllers/equipmentController.js';

// Get all equipment
router.get('/', getAllEquipment);

// Create new equipment
router.post('/',createEquipment);

// Update equipment status
router.patch('/:id/status', updateEquipmentStatus);

// Get equipment statistics
router.get('/stats', getEquipmentStats);

export default router;