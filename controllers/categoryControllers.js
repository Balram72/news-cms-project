const categoryModel = require("../models/Category");

exports.allCategory = async (req, res) => {
  const category = await categoryModel.find();
  res.render("admin/category", { category, role: req.role });
};
exports.addCategoryPage = async (req, res) => {
  res.render("admin/category/create", { role: req.role });
};
exports.addCategory = async (req, res) => {
  try {
    await categoryModel.create(req.body);
    res.redirect("/admin/category");
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.updateCategoryPage = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.render("admin/category/update", { category, role: req.role });
  } catch (error) {
    return res.status(400).send(error);
  }
};
exports.updateCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findByIdAndUpdate(id, req.body);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.redirect("/admin/category");
  } catch (error) {
    return res.status(400).send(error);
  }
};
exports.deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await categoryModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json({ success: true });
  } catch (error) {
    return res.status(400).send(error);
  }
};
