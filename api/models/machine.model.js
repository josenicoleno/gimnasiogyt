import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://www.hostinger.it/tutorial/wp-content/uploads/sites/24/2023/09/come-scrivere-un-blog-768x334.webp",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: "Published",
    },
  },
  { timestamps: true, collection: 'machines' }
);

const Machine = mongoose.model("Machine", machineSchema);
export default Machine;
