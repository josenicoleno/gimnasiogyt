import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/", getCategories);
router.post("/create", verifyToken, createCategory);
router.delete("/delete/:categoryId", verifyToken, deleteCategory);
router.put("/update/:categoryId", verifyToken, updateCategory);

export default router;
