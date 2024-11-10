import express from "express";
import {
  createExcerciseCategory,
  deleteExcerciseCategory,
  getExcerciseCategories,
  updateExcerciseCategory,
} from "../controllers/excerciseCategory.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/", getExcerciseCategories);
router.post("/create", verifyToken, createExcerciseCategory);
router.delete("/delete/:categoryId", verifyToken, deleteExcerciseCategory);
router.put("/update/:categoryId", verifyToken, updateExcerciseCategory);

export default router;
