import Excercise from "../models/excercise.model.js";
import { errorHandler } from "../utils/error.js";

export const createExcercise = async (req, res, next) => {
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
  const newExcercise = new Excercise({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedExcercise = await newExcercise.save();
    res.status(200).json({ savedExcercise });
  } catch (error) {
    next(error);
  }
};

export const getExcercises = async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  try {
    const excercises = await Excercise.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.excerciseId && { _id: req.query.excerciseId }),
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

    const totalExcercises = await Excercise.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const totalExcercisesLastMonth = await Excercise.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      excercises,
      totalExcercises,
      totalExcercisesLastMonth,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExcercise = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this excercise"));
  }
  try {
    await Excercise.findByIdAndDelete(req.params.excerciseId);
    res.status(200).json("The excercise has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateExcercise = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this excercise"));
  }
  try {
    const updateExcercise = await Excercise.findByIdAndUpdate(
      req.params.excerciseId,
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
    res.status(200).json(updateExcercise);
  } catch (error) {
    next(error);
  }
};
