import mongoose from "mongoose";

const excersiseCategorySchema = new mongoose.Schema(
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

const ExcersiseCategory = mongoose.model("ExcersiseCategory", excersiseCategorySchema);

export default ExcersiseCategory;
