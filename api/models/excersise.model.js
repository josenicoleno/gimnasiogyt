import mongoose from "mongoose";

const excersiseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  excersiseCategory: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Excersise = mongoose.model("Excersise", excersiseSchema);

export default Excersise;

