import express from "express";
import {
  createExerciseCategory,
  deleteExerciseCategory,
  getExerciseCategories,
  updateExerciseCategory,
} from "../controllers/exerciseCategory.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/", getExerciseCategories);
router.post("/create", verifyToken, createExerciseCategory);
router.delete("/delete/:categoryId", verifyToken, deleteExerciseCategory);
router.put("/update/:categoryId", verifyToken, updateExerciseCategory);

export default router;
