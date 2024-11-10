import mongoose from "mongoose";

const excerciseCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        inMenu: {
            type: Boolean,
            default: false
        },
        image: {
            type: String,
            default: undefined

        },
        type: {
            type: String,
            enum: ["card", "post"],
            required: true
        },
        order: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const excerciseCategory = mongoose.model("excerciseCategory", excerciseCategorySchema);

export default excerciseCategory;
