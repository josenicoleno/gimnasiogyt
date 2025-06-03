import Routine from '../models/routine.model.js';

// Crear una nueva rutina
export const createRoutine = async (req, res) => {
  try {
    const routine = new Routine({
      name: req.body.name,
      description: req.body.description,
      file: req.body.file,
      fechaDesde: req.body.fechaDesde,
      fechaHasta: req.body.fechaHasta,
      createdBy: req.user._id
    });
    await routine.save();
    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las rutinas
export const getRoutines = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const routines = await Routine.find(
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.createdBy && { createdBy: req.query.createdBy }),
      ...(req.query.status && { status: req.query.status }),
      ...(req.query.routineId && { _id: req.query.routineId }),
      ...(req.query.searchTerm && {
        $or: [
          { name: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    )
      .populate('createdBy', 'name')
      .populate('users', 'name')
      .sort({ fechaDesde: -1 })
      .skip(startIndex)
      .limit(limit);
    const totalRoutines = await Routine.countDocuments();

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
      fechaHasta: { $gte: now }
    })
    .populate('createdBy', 'name')
    .sort({ fechaDesde: -1 });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener rutinas de un usuario específico
export const getUserRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({ users: req.params.userId })
      .populate('createdBy', 'name')
      .sort({ fechaDesde: -1 });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Asignar usuarios a una rutina
export const assignUsers = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    // Agregar nuevos usuarios sin duplicados
    const newUsers = req.body.userIds.filter(
      userId => !routine.users.includes(userId)
    );
    routine.users.push(...newUsers);
    
    await routine.save();
    res.json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remover usuarios de una rutina
export const removeUsers = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    // Remover usuarios especificados
    routine.users = routine.users.filter(
      userId => !req.body.userIds.includes(userId.toString())
    );
    
    await routine.save();
    res.json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una rutina
export const deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    if (routine.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta rutina' });
    }

    await routine.deleteOne();
    res.json({ message: 'Rutina eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 