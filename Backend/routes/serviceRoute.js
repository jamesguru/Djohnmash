import express from 'express';
import { createService, deleteService, getServices, updateService } from '../controllers/serviceController.js';
const router = express.Router();

router.post('/', createService);
router.get('/', getServices);
router.delete('/:id', deleteService)
router.put('/:id', updateService)

export default router;