import mongoose from "mongoose";
import Routine from "../models/routine.model.js";
import { sendRoutineAssignmentEmail } from "../utils/emails.js";
import User from "../models/user.model.js";

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
      users: req.body.users
        ? req.body.users.map((userId) => ({
            user: userId,
            completed: false,
          }))
        : [],
      createdBy: mongoose.Types.ObjectId.createFromHexString(req.user.id),
    });
    await routine.save();
    res.status(201).json(routine);
    // Notificar a los usuarios asignados
    if (routine.users && routine.users.length > 0) {
      for (const user of routine.users) {
        const userData = await User.findById(user.user);
        if (userData && userData.email) {
          await sendRoutineAssignmentEmail(
            userData.email,
            routine.name,
            routine.startDate,
            routine.endDate
          );
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

// Obtener todas las rutinas
export const getRoutines = async (req, res, next) => {
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
      .populate("createdBy", "username email profilePicture")
      .populate("users", "username email profilePicture")
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
export const getUserRoutines = async (req, res, next) => {
  try {
    const routines = await Routine.find({
      "users.user": req.params.userId,
      status: "Published",
    })
      .populate("createdBy", "username")
      .sort({ fechaDesde: -1 });

    const totalRoutines = await Routine.countDocuments({
      "users.user": req.params.userId,
    });

    res.status(200).json({
      routines,
      totalRoutines,
    });
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

    // Obtener los IDs de usuarios actuales
    const currentUserIds = routine.users.map(user => user.user.toString());

    // Filtrar y formatear nuevos usuarios
    const newUsers = req.body.userIds
      .filter(userId => !currentUserIds.includes(userId.toString()))
      .map(userId => ({
        user: userId,
        completed: false
      }));

    // Agregar nuevos usuarios
    routine.users.push(...newUsers);

    await routine.save();

    // Notificar a los nuevos usuarios asignados
    for (const newUser of newUsers) {
      const userData = await User.findById(newUser.user);
      if (userData && userData.email) {
        await sendRoutineAssignmentEmail(
          userData.email,
          routine.name,
          routine.startDate,
          routine.endDate
        );
      }
    }

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
export const deleteRoutine = async (req, res, next) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) {
      return res.status(404).json({ message: "Rutina no encontrada" });
    }
    /*  if (routine.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta rutina" });
    } */
    await routine.deleteOne();
    res.json({ message: "Rutina eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};
