import PersonalRecord from "../models/personalRecord.model.js";
import Exercise from "../models/exercise.model.js";

// Crear un nuevo registro personal
export const createPersonalRecord = async (req, res) => {
  const { userId, exerciseId, record } = req.body;
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
      createdBy,
    });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los registros de un usuario (opcional: filtrar por ejercicio)
export const getPersonalRecords = async (req, res) => {
  const { userId } = req.params;
  const { exerciseId } = req.query;
  try {
    // Validar que el usuario puede acceder a los datos (propios o si es admin)
    if (!req.user.isAdmin && req.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder a estos registros" });
    }

    const filter = { userId };
    if (exerciseId) filter.exerciseId = exerciseId;

    const recordsBeforePopulate = await PersonalRecord.find(filter);
    console.log('Registros antes del populate:', recordsBeforePopulate);

    const ejerciciosPrueba = await Exercise.find({
      _id: { 
        $in: [
          '6734fd6cce39dc958bf12322',
          '6734fe0ace39dc958bf1233b'
        ]
      }
    });
    console.log('Ejercicios encontrados:', ejerciciosPrueba);

    const records = await PersonalRecord.find(filter)
      .populate("userId", "username")
      .populate("createdBy", "username")
      .populate("exerciseId", "title")
      .exec();

    console.log('Registros después del populate:', records);

    res.status(200).json(records);
  } catch (error) {
    console.error('Error completo:', error);
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
