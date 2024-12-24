import  express from 'express';
import {
  joinMembership,
  cancelMembership,
  getMemberships
} from '../controllers/membershipControllers.js';
const router = express.Router();

router.post('/', joinMembership);
router.put('/:id', cancelMembership);
router.get('/', getMemberships);

export default router;