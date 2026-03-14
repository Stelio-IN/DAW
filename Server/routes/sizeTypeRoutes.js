import { Router } from "express";
import sizeTypeController from "../controllers/sizeTypeController.js";

const router = Router();

router.post("/", sizeTypeController.createSizeType);
router.get("/", sizeTypeController.getAllSizeTypes);

export default router;
