import exerciseCategory from "../models/exerciseCategory.model.js";

export const getExerciseCategories = async (req, res, next) => {
  try {
    const categories = await exerciseCategory.find({
      ...(req.query.category && { name: req.query.category })}
    );
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const createExerciseCategory = async (req, res, next) => {
  try {
    const newexerciseCategory = new exerciseCategory({ ...req.body });
    const savedexerciseCategory = await newexerciseCategory.save();
    if (!savedexerciseCategory) {
      return next(errorHandler(400, "Failed to create category"));
    }
    res.status(200).json(savedexerciseCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteExerciseCategory = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (!req.params.categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }
    const categoryId = req.params.categoryId;
    const deletedCategory = await exerciseCategory.findByIdAndDelete(categoryId);
    res.status(200).json(deletedCategory);
  } catch (error) {
    next(error);
  }
};

export const updateExerciseCategory = async (req, res, next) => {
  try {
    if (!req.params.categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }
    const categoryId = req.params.categoryId;
    const category = await exerciseCategory.findById(categoryId);
    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }
    if (!req.user.isAdmin) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (!req.body.name) {
      return next(errorHandler(400, "Name is required"));
    }
    const updatedCategory = await exerciseCategory.findByIdAndUpdate(
      categoryId,
      { ...req.body },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};
