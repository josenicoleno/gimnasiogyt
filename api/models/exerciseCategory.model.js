import mongoose from "mongoose";

const exerciseCategorySchema = new mongoose.Schema(
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

const exerciseCategory = mongoose.model("exerciseCategory", exerciseCategorySchema);

export default exerciseCategory;
