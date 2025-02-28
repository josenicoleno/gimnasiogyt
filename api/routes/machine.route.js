import express from "express";
import {
  createMachine,
  deleteMachine,
  getMachines,
  updateMachine,
} from "../controllers/machine.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/", getMachines);
router.post("/create", verifyToken, createMachine);
router.delete("/delete/:machineId", verifyToken, deleteMachine);
router.put("/update/:machineId", verifyToken, updateMachine);

export default router;
