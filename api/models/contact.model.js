import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    content: {
      type: String,
    },
    type: {
      type: ["Contact us", "Registration"],
      default: "Contact us",
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
