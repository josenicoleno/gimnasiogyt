import mongoose from "mongoose";

const routineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    file: {
      type: String,
      /* required: true */
    },
    startDate: {
      type: Date,
      /* required: true */
    },
    endDate: {
      type: Date,
      /* required: true */
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Draft",
    },
    users: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          /* required: true */
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: {
          type: Date,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          default: null
        },
        intensity: {
          type: Number,
          min: 1,
          max: 5,
          default: null
        },
        comment: {
          type: String,
          trim: true,
          maxLength: 500
        }
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Routine = mongoose.model("Routine", routineSchema);

export default Routine;
