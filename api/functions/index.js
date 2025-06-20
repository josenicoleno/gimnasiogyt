import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "../routes/user.route.js";
import authRoutes from "../routes/auth.route.js";
import postRoutes from "../routes/post.route.js";
import commentRoutes from "../routes/comment.route.js";
import categoryRoutes from "../routes/category.route.js";
import contactRoutes from "../routes/contact.route.js";
import paramRoutes from "../routes/param.route.js";
import exerciseRoutes from "../routes/exercise.route.js";
import exerciseCategoryRoutes from "../routes/exerciseCategory.route.js";
import personalRecordRoutes from "../routes/personalRecord.route.js";
import machineRoutes from '../routes/machine.route.js'
import routineRoutes from '../routes/routine.route.js'
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/exerciseCategory", exerciseCategoryRoutes);
app.use("/api/exercise", exerciseRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/param", paramRoutes);
app.use("/api/personalRecord", personalRecordRoutes);
app.use("/api/machine", machineRoutes);
app.use("/api/routine", routineRoutes);
const __html = path.resolve();
app.use(express.static(path.join(__html, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__html, "/client/dist/index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
