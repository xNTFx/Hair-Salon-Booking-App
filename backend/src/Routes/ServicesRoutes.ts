import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';

const router = Router();

router.get('/', ServiceController.getAll);

export default router;
