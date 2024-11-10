import excerciseCategory from "../models/excerciseCategory.model.js";

export const getExcerciseCategories = async (req, res, next) => {
  try {
    const categories = await excerciseCategory.find({
      ...(req.query.category && { name: req.query.category })}
    );
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const createExcerciseCategory = async (req, res, next) => {
  try {
    const newexcerciseCategory = new excerciseCategory({ ...req.body });
    const savedexcerciseCategory = await newexcerciseCategory.save();
    if (!savedexcerciseCategory) {
      return next(errorHandler(400, "Failed to create category"));
    }
    res.status(200).json(savedexcerciseCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteExcerciseCategory = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (!req.params.categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }
    const categoryId = req.params.categoryId;
    const deletedCategory = await excerciseCategory.findByIdAndDelete(categoryId);
    res.status(200).json(deletedCategory);
  } catch (error) {
    next(error);
  }
};

export const updateExcerciseCategory = async (req, res, next) => {
  try {
    if (!req.params.categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }
    const categoryId = req.params.categoryId;
    const category = await excerciseCategory.findById(categoryId);
    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }
    if (!req.user.isAdmin) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (!req.body.name) {
      return next(errorHandler(400, "Name is required"));
    }
    const updatedCategory = await excerciseCategory.findByIdAndUpdate(
      categoryId,
      { ...req.body },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};
