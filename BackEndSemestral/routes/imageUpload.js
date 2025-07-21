import express from 'express';
import multer from 'multer';
import imageUploadController from '../controllers/imageUploadController.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload/:product_color_id', upload.single('image'), imageUploadController.uploadImage);

export default router;
