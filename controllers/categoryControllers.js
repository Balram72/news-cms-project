const categoryModel = require("../models/Category");

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
    res.render("admin/category/create", { role: req.role });
  } catch (error) {
    next(error);
  }
};
exports.addCategory = async (req, res, next) => {
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
    res.render("admin/category/update", { category, role: req.role });
  } catch (error) {
    next(error);
  }
};
exports.updateCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findByIdAndUpdate(id, req.body);
    if (!category) {
      return next(createError("Category not found", 404));
    }
    res.redirect("/admin/category");
  } catch (error) {
    next(error);
  }
};
exports.deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findByIdAndDelete(id);
    if (!category) {
      return next(createError("Category not found", 404));
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
