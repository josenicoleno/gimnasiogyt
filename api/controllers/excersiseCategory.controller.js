import ExcersiseCategory from "../models/excersiseCategory.model.js";

export const getExcersiseCategories = async (req, res, next) => {
  try {
    const categories = await ExcersiseCategory.find({
      ...(req.query.category && { name: req.query.category })}
    );
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const createExcersiseCategory = async (req, res, next) => {
  try {
    const newExcersiseCategory = new ExcersiseCategory({ ...req.body });
    const savedExcersiseCategory = await newExcersiseCategory.save();
    if (!savedExcersiseCategory) {
      return next(errorHandler(400, "Failed to create category"));
    }
    res.status(200).json(savedExcersiseCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteExcersiseCategory = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (!req.params.categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }
    const categoryId = req.params.categoryId;
    const deletedCategory = await ExcersiseCategory.findByIdAndDelete(categoryId);
    res.status(200).json(deletedCategory);
  } catch (error) {
    next(error);
  }
};

export const updateExcersiseCategory = async (req, res, next) => {
  try {
    if (!req.params.categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }
    const categoryId = req.params.categoryId;
    const category = await ExcersiseCategory.findById(categoryId);
    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }
    if (!req.user.isAdmin) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (!req.body.name) {
      return next(errorHandler(400, "Name is required"));
    }
    const updatedCategory = await ExcersiseCategory.findByIdAndUpdate(
      categoryId,
      { ...req.body },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};
