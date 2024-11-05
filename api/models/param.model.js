import mongoose from "mongoose";

const paramSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    text: { type: String},
    date: { type: Date },
    image: { type: String },
    boolean: { type: Boolean },
    number: { type: Number },
  },
  { timestamps: true }
);

const Param = mongoose.model("Param", paramSchema);

export default Param;

