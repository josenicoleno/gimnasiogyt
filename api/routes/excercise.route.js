import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createExcercise, deleteExcercise, getExcercises, updateExcercise } from "../controllers/excercise.controller.js";


const router = express.Router();

router.get("/getexcercises", getExcercises);
router.post("/create", verifyToken, createExcercise);
router.put("/update/:excerciseId/:userId", verifyToken, updateExcercise);
router.delete("/delete/:excerciseId/:userId", verifyToken, deleteExcercise);

export default router;
