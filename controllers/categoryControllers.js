const categoryModel = require("../models/Category");
const newsModel = require("../models/News");
const createError = require("../utils/error-message");
const { validationResult } = require("express-validator");

exports.allCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.find();
    res.render("admin/category", { category, role: req.role });
  } catch (error) {
    next(error);
  }
};
exports.addCategoryPage = async (req, res, next) => {
  try {
    res.render("admin/category/create", { role: req.role, errors: 0 });
  } catch (error) {
    next(error);
  }
};
exports.addCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/category/create", {
      role: req.role,
      errors: errors.array(),
    });
  }
  try {
    await categoryModel.create(req.body);
    res.redirect("/admin/category");
  } catch (error) {
    next(error);
  }
};
exports.updateCategoryPage = async (req, res, next) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return next(createError("Category not found", 404));
    }
    res.render("admin/category/update", {
      category,
      role: req.role,
      errors: 0,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateCategory = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const category = await categoryModel.findById(id);
    return res.render("admin/category/update", {
      category,
      role: req.role,
      errors: errors.array(),
    });
  }
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return next(createError("Category not found", 404));
    }
    category.name = req.body.name;
    category.description = req.body.description;
    await category.save();

    res.redirect("/admin/category");
  } catch (error) {
    next(error);
  }
};
exports.deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return next(createError("Category not found", 404));
    }
    const article = await newsModel.findOne({ category: id });
    if (article) {
      return res.status(400).json({
        success: false,
        message: "Category is associated with an article",
      });
    }
    await category.deleteOne();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
