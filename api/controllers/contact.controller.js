import Contact from "../models/contact.model.js";
import User from "../models/user.model.js";
import { sendContactEmail, sendRegistrationtEmail } from "../utils/emails.js";
import { errorHandler } from "../utils/error.js";

export const createContact = async (req, res, next) => {
  const type = req.query.type || "Contact us";
  const newContact = new Contact({ ...req.body, type });
  try {
    if (!newContact.name || !newContact.email || !newContact.content) {
      return next(errorHandler(400, "All fields are required"));
    }
    if (newContact.userId.trim() === "") {
      newContact.userId = undefined;
    }
    await newContact.save();
    res.status(201).json({ message: "Send message successfully" });
    await sendContactEmail(
      newContact.email,
      newContact.name,
      newContact.content
    );
    const users = await User.find({ isAdmin: true });
    if (type === "Contact us")
      users.forEach(async (user) => {
        await sendContactEmail(user.email, newContact.name, newContact.content);
      });
    else
      users.forEach(async (user) => {
        await sendRegistrationtEmail(
          user.email,
          newContact.name,
          newContact.content,
          newContact.phone
        );
      });
  } catch (error) {
    next(error);
  }
};
