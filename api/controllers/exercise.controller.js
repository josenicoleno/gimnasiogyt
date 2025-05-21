import Exercise from "../models/exercise.model.js";
import { errorHandler } from "../utils/error.js";

export const createExercise = async (req, res, next) => {
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
  const newExercise = new Exercise({
    ...req.body,
    machines: req.body.machines || [],
    slug,
    userId: req.user.id,
  });
  try {
    const savedExercise = await newExercise.save();
    res.status(200).json({ savedExercise });
  } catch (error) {
    next(error);
  }
};

export const getExercises = async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  try {
    const exercises = await Exercise.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.status && { category: req.query.status }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.exerciseId && { _id: req.query.exerciseId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .populate("machines", "title image")
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalExercises = await Exercise.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const totalExercisesLastMonth = await Exercise.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      exercises,
      totalExercises,
      totalExercisesLastMonth,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExercise = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to delete this exercise")
    );
  }
  try {
    await Exercise.findByIdAndDelete(req.params.exerciseId);
    res.status(200).json("The exercise has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateExercise = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to update this exercise")
    );
  }
  try {
    const updateExercise = await Exercise.findByIdAndUpdate(
      req.params.exerciseId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          status: req.body.status,
          category: req.body.category,
          image: req.body.image,
          machines: req.body.machines || [],
        },
      },
      { new: true }
    );
    res.status(200).json(updateExercise);
  } catch (error) {
    next(error);
  }
};
