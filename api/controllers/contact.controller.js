import Contact from "../models/contact.model.js";
import User from "../models/user.model.js";
import { sendContactEmail, sendRegistrationtEmail } from "../utils/emails.js";
import { errorHandler } from "../utils/error.js";
import { verifyCaptcha } from "../utils/captcha.js";

export const getContacts = async (req, res, next) => {
  if (!req.user.isAdmin) {
    errorHandler(403, "You are not allowed to see this contacts");
  }
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = parseInt(req.query.sort === "desc" ? -1 : 1);

  try {
    const allContacts = await Contact.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const contacts = await Promise.all(
      allContacts.map(async (contact) => {
        if (contact.userId) {
          const user = await User.findById(contact.userId);
          const { username, profilePicture } = user || {};
          return {
            ...contact._doc,
            userUsername: username,
            userProfilePicture: profilePicture,
          };
        } else {
          return {
            ...contact._doc,
            userUsername: "",
            userProfilePicture: "",
          };
        }
      })
    );

    const totalContacts = await Contact.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const totalContactsLastMonth = await Contact.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    await res.status(200).json({
      contacts,
      totalContacts,
      totalContactsLastMonth,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const type = req.query.type || "Contact us";
  const newContact = new Contact({ ...req.body, type });
  try {
    const { name, email, content, captchaToken } = req.body;

    // Verificar el captcha
    const isValidCaptcha = await verifyCaptcha(captchaToken);
    if (!isValidCaptcha) {
      return res.status(400).json({ message: "Verificación de captcha fallida" });
    }

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

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) {
      return next(errorHandler(404, "Contact not found"));
    }
    if (contact.userId !== req.user.id && !req.user.isAdmin) {
      errorHandler(403, "You are not allowed to edit this contact");
    }
    await Contact.findByIdAndDelete(req.params.contactId);
    res.status(200).json("Contact has been deleted");
  } catch (error) {
    next(error);
  }
};
