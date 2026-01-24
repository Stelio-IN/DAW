import { Router } from 'express';
import jibbitzController from '../controllers/jibbitzController.js';

const router = Router();

router.get('/jibs', jibbitzController.Jibbitzs);
router.get('/jibs/:id', jibbitzController.getJibbitzDetails);

export default router;
