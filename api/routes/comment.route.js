import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getPostComment,
  likeComment,
  getComments
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/getPostComment/:postId", getPostComment);
router.get("/", verifyToken, getComments);
router.post("/create", verifyToken, createComment);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/update/:commentId", verifyToken, editComment);
router.delete("/delete/:commentId", verifyToken, deleteComment);

export default router;
