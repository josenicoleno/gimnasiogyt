import mongoose from "mongoose";
import Routine from "../models/routine.model.js";

// Crear una nueva rutina
export const createRoutine = async (req, res, next) => {
  try {
    const routine = new Routine({
      name: req.body.name,
      description: req.body.description,
      file: req.body.file,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
      users: req.body.users || [],
      createdBy: mongoose.Types.ObjectId.createFromHexString(req.user.id),
    });
    await routine.save();
    res.status(201).json(routine);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las rutinas
export const getRoutines = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    
    const query = {};
    
    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.createdBy) query.createdBy = req.query.createdBy;
    if (req.query.status) query.status = req.query.status;
    if (req.query.routineId) query._id = req.query.routineId;
    if (req.query.searchTerm) {
      query.$or = [
        { name: { $regex: req.query.searchTerm, $options: "i" } },
        { description: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const routines = await Routine.find(query)
      .populate("createdBy", "name")
      .populate("users", "name")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalRoutines = await Routine.countDocuments(query);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const totalRoutinesLastMonth = await Routine.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      routines,
      totalRoutines,
      totalRoutinesLastMonth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener rutinas activas de un usuario
export const getUserActiveRoutines = async (req, res) => {
  try {
    const now = new Date();
    const routines = await Routine.find({
      users: req.params.userId,
      fechaDesde: { $lte: now },
      fechaHasta: { $gte: now },
    })
      .populate("createdBy", "name")
      .sort({ fechaDesde: -1 });
    res.json(routines);
  } catch (error) {
    next(error);
  }
};

// Obtener rutinas de un usuario específico
export const getUserRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({ users: req.params.userId })
      .populate("createdBy", "name")
      .sort({ fechaDesde: -1 });
    res.json(routines);
  } catch (error) {
    next(error);
  }
};

// Asignar usuarios a una rutina
export const assignUsers = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }

    // Agregar nuevos usuarios sin duplicados
    const newUsers = req.body.userIds.filter(
      (userId) => !routine.users.includes(userId)
    );
    routine.users.push(...newUsers);

    await routine.save();
    res.json(routine);
  } catch (error) {
    next(error);
  }
};

// Remover usuarios de una rutina
export const removeUsers = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }

    // Remover usuarios especificados
    routine.users = routine.users.filter(
      (userId) => !req.body.userIds.includes(userId.toString())
    );

    await routine.save();
    res.json(routine);
  } catch (error) {
    next(error);
  }
};

// Eliminar una rutina
export const deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }
    if (routine.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta rutina" });
    }
    await routine.deleteOne();
    res.json({ message: "Rutina eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};
