import express from "express";
import {
  createPersonalRecord,
  deletePersonalRecord,
  getAllPersonalRecords,
  getPersonalRecords,
  updatePersonalRecord,
} from "../controllers/personalRecord.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Crear un nuevo registro personal
router.post("/", verifyToken, createPersonalRecord);

// Obtener todos los registros de un usuario (opcional: filtrar por ejercicio)
router.get("/", verifyToken, getPersonalRecords);
router.get("/personalRecords", verifyToken, getAllPersonalRecords);

// Actualizar un registro personal
router.put("/:id", verifyToken, updatePersonalRecord);

// Eliminar un registro personal
router.delete("/:id", verifyToken, deletePersonalRecord);

export default router;
