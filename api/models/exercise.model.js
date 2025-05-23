import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
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
    category: {
      type: String,
      default: "uncategorized",
    },
    machines: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine'
    }],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'exercises' }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);
export default Exercise;
