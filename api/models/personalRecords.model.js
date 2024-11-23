import mongoose from "mongoose";

const personalRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    record: {
      weight: Number, // en kg o lb
      reps: Number, // repeticiones
      time: String, // tiempo si aplica (ej: '10:30' para cardio)
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PersonalRecord = mongoose.model("PersonalRecord", personalRecordSchema);
export default PersonalRecord;
