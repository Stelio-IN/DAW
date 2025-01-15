import { Router } from "express";
import genderController from "../controllers/genderController.js";

const router = Router();

router.post("/", genderController.createGender);
router.get("/", genderController.getAllGender);

export default router;
