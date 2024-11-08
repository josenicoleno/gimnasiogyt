import express from "express";
import {
  getExcersiseCategories,
  createExcersiseCategory,
  deleteExcersiseCategory,
  updateExcersiseCategory,
} from "../controllers/excersiseCategory.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/", getExcersiseCategories);
router.post("/create", verifyToken, createExcersiseCategory);
router.delete("/delete/:categoryId", verifyToken, deleteExcersiseCategory);
router.put("/update/:categoryId", verifyToken, updateExcersiseCategory);

export default router;
