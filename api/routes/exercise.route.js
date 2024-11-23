import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createExercise,
  deleteExercise,
  getExercises,
  updateExercise,
} from "../controllers/exercise.controller.js";
const router = express.Router();

router.get("/getexercises", getExercises);
router.post("/create", verifyToken, createExercise);
router.put("/update/:exerciseId/:userId", verifyToken, updateExercise);
router.delete("/delete/:exerciseId/:userId", verifyToken, deleteExercise);

export default router;
