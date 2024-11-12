import express from "express";
import {
  createContact,
  deleteContact,
  getContacts,
} from "../controllers/contact.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/", verifyToken, getContacts);
router.post("/create", createContact);
router.delete("/delete/:contactId", verifyToken, deleteContact);

export default router;
