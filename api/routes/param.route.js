import express from "express";
import {
  createParam,
  deleteParam,
  getParams,
  updateParam,
} from "../controllers/param.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/:key", getParams);
router.post("/create", verifyToken, createParam);
router.put("/:id", verifyToken, updateParam);
router.delete("/:id", verifyToken, deleteParam);

export default router;
