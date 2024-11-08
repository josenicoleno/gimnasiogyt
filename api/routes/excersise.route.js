import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createExcersise,
  deleteExcersise,
  getExcersises,
  updateExcersise,
} from "../controllers/excersise.controller.js";

const router = express.Router();

router.get("/getexcersises", getExcersises);
router.post("/create", verifyToken, createExcersise);
router.put("/update/:excersiseId/:userId", verifyToken, updateExcersise);
router.delete("/delete/:excersiseId/:userId", verifyToken, deleteExcersise);

export default router;
