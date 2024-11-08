import Excersise from "../models/excersise.model.js";
import { errorHandler } from "../utils/error.js";

export const createExcersise = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newExcersise = new Excersise({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedExcersise = await newExcersise.save();
    res.status(200).json({ savedExcersise });
  } catch (error) {
    next(error);
  }
};

export const getExcersises = async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  try {
    const excersises = await Excersise.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.excersiseId && { _id: req.query.excersiseId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalExcersises = await Excersise.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const totalExcersisesLastMonth = await Excersise.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      excersises,
      totalExcersises,
      totalExcersisesLastMonth,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExcersise = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this excersise"));
  }
  try {
    await Excersise.findByIdAndDelete(req.params.excersiseId);
    res.status(200).json("The excersise has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateExcersise = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this excersise"));
  }
  try {
    const updateExcersise = await Excersise.findByIdAndUpdate(
      req.params.excersiseId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updateExcersise);
  } catch (error) {
    next(error);
  }
};
