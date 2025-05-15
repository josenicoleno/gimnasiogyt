import express from "express";
import { checkIn, checkOut, getAttendance } from "../controllers/attendance.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Registrar entrada
router.post("/check-in", verifyToken, checkIn);

// Registrar salida
router.post("/check-out", verifyToken, checkOut);

// Obtener registros de asistencia
router.get("/", verifyToken, getAttendance);

export default router; 