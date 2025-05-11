import machine from "../models/machine.model.js";

export const getMachines = async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  try {
    const machines = await machine
      .find({
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.machineId && { _id: req.query.machineId }),
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

    const totalMachine = await machine.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const totalMachineMonth = await machine.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      machines,
      totalMachine,
      totalMachineMonth,
    });
  } catch (error) {
    next(error);
  }
};

export const createMachine = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a machine"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newMachine = new machine({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedMachine = await newMachine.save();
    res.status(200).json({ savedMachine });
  } catch (error) {
    next(error);
  }
};

export const deleteMachine = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (!req.params.categoryId) {
      return next(errorHandler(400, "Category ID is required"));
    }
    const categoryId = req.params.categoryId;
    const deletedCategory = await exerciseCategory.findByIdAndDelete(
      categoryId
    );
    res.status(200).json(deletedCategory);
  } catch (error) {
    next(error);
  }
};

export const updateMachine = async (req, res, next) => {
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
