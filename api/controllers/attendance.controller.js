import Attendance from "../models/attendance.model.js";

// Registrar entrada
export const checkIn = async (req, res) => {
  const { userId } = req.body;
  const createdBy = req.user.id;

  try {
    // Verificar si ya existe un registro de entrada para hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Ya existe un registro de entrada para hoy"
      });
    }

    const newAttendance = new Attendance({
      userId,
      checkIn: new Date(),
      createdBy
    });

    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Registrar salida
export const checkOut = async (req, res) => {
  const { userId } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (!attendance) {
      return res.status(404).json({
        message: "No se encontró un registro de entrada para hoy"
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        message: "Ya existe un registro de salida para hoy"
      });
    }

    attendance.checkOut = new Date();
    await attendance.save();
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener registros de asistencia
export const getAttendance = async (req, res) => {
  const { userId, startDate, endDate } = req.query;

  try {
    const query = {};
    if (userId) query.userId = userId;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate("userId", "username")
      .populate("createdBy", "username")
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 