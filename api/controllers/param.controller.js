import Param from "../models/param.model.js";
import { errorHandler } from "../utils/error.js";

export const createParam = async (req, res, next) => {
    const param = await Param.create(req.body);
    if (!param) return next(errorHandler(400, "Param not created"));
    res.status(201).json(param);
}

export const getParams = async (req, res, next) => {
    const params = await Param.findOne({key: req.params.key});
    if (!params) return next(errorHandler(400, "No params found"));
    res.status(200).json(params);
}

export const updateParam = async (req, res, next) => {
    const param = await Param.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!param) return next(errorHandler(400, "Param not found"));
    res.status(200).json(param);
}

export const deleteParam = async (req, res, next) => {
    const param = await Param.findByIdAndDelete(req.params.id);
    if (!param) return next(errorHandler(400, "Param not found"));
    res.status(200).json({message: "Param deleted"});
}

