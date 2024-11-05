import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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

const Category = mongoose.model("Category", categorySchema);

export default Category;
