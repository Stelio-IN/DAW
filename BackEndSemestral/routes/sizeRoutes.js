import { Router } from "express";
import sizeController from "../controllers/SizeController.js";

const router = Router();

router.post("/", sizeController.createSize);
router.get("/", sizeController.getAllSize);


// Nova rota para obter tamanhos por tipo
router.get("/type/:sizeTypeId", sizeController.getSizesByType);

export default router;
