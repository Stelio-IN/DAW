import { Router } from 'express';
import colorController from '../controllers/colorController.js';

const router = Router();

router.post('/', colorController.createColor);
router.get('/', colorController.getAllColors);
router.get('/:id', colorController.getColorById);
router.put('/:id', colorController.updateColor);
router.delete('/:id', colorController.deleteColor);

export default router;
 