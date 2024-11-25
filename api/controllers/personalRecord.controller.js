import PersonalRecord from "../models/personalRecord.model.js";
import User from "../models/user.model.js";
import Exercise from "../models/exercise.model.js";
import { ObjectId } from "mongodb";

// Crear un nuevo registro personal
export const createPersonalRecord = async (req, res) => {
  const { userId, exerciseId, record, date } = req.body;
  const createdBy = req.user.id; // Usuario que está creando el registro

  try {
    // Validar que el usuario logueado puede actuar como admin o crear para sí mismo
    if (!req.user.isAdmin && req.user.id !== userId) {
      return res.status(403).json({
        message: "No tienes permisos para crear registros para otros usuarios",
      });
    }

    const newRecord = new PersonalRecord({
      userId,
      exerciseId,
      record,
      date,
      createdBy,
    });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los registros de un usuario (opcional: filtrar por ejercicio) agrupados por persona y ejercicio
export const getPersonalRecords = async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const { userId, exerciseId } = req.query;

  try {
    // Validar permisos (solo admin o el mismo usuario)
    if (!req.user.isAdmin && req.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder a estos registros" });
    }
    const match = {};
    if (userId) match.userId = userId;
    if (exerciseId) match.exerciseId = exerciseId;
    let records = await PersonalRecord.aggregate([
      {
        $group: {
          _id: { userId: "$userId", exerciseId: "$exerciseId" },
          count: { $sum: 1 }, // Contar el número de registros por grupo
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          exerciseId: "$_id.exerciseId",
          count: 1,
        },
      },
    ]);
    // Filtrar registros por userId y exerciseId
    records = records.filter((record) => {
      const userMatch = userId
        ? record.userId.equals(new ObjectId(userId))
        : true;
      const exerciseMatch = exerciseId
        ? record.exerciseId.equals(new ObjectId(exerciseId))
        : true;
      return userMatch && exerciseMatch;
    });

    const recordsWithDetails = await Promise.all(
      records.map(async (r) => {
        const user = await User.findById(r.userId).select("username");
        const { title, slug, image } = await Exercise.findById(r.exerciseId);
        const { date, createdBy, record } = await PersonalRecord.findOne({
          userId: r.userId,
          exerciseId: r.exerciseId,
        }).sort({ date: -1, createdAt: -1 });

        const userCreator = await User.findById(createdBy).select("username");
        return {
          ...r,
          username: user.username,
          title,
          slug,
          image,
          date,
          record,
          createdBy,
          createdByUsername: userCreator.username,
        };
      })
    );

    // Ordenar los registros por fecha
    recordsWithDetails.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(recordsWithDetails);
  } catch (error) {
    console.error("Error completo:", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los registros de un usuario (opcional: filtrar por ejercicio)
export const getAllPersonalRecords = async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const { userId } = req.query;
  const { exerciseId } = req.query;
  try {
    // Validar que el usuario puede acceder a los datos (propios o si es admin)
    if (!req.user.isAdmin && req.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder a estos registros" });
    }

    const filter = {};
    if (userId) filter.userId = userId;
    if (exerciseId) filter.exerciseId = exerciseId;

    const records = await PersonalRecord.find(filter)
      .populate("userId", "username")
      .populate("createdBy", "username")
      .populate("exerciseId", "title image slug")
      .sort({ date: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .exec();

    res.status(200).json(records);
  } catch (error) {
    console.error("Error completo:", error);
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un registro personal
export const updatePersonalRecord = async (req, res) => {
  const { id } = req.params;
  const { record } = req.body;

  try {
    // Verificar que el registro existe
    const existingRecord = await PersonalRecord.findById(id);
    if (!existingRecord) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    // Validar que el usuario puede modificar el registro (propio o si es admin)
    if (!req.user.isAdmin && existingRecord.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para modificar este registro" });
    }

    existingRecord.record = record;
    const updatedRecord = await existingRecord.save();
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un registro personal
export const deletePersonalRecord = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar que el registro existe
    const existingRecord = await PersonalRecord.findById(id);
    if (!existingRecord) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    // Validar que el usuario puede eliminar el registro (propio o si es admin)
    if (!req.user.isAdmin && existingRecord.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para eliminar este registro" });
    }

    await PersonalRecord.findByIdAndDelete(id);
    res.status(200).json({ message: "Registro eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
