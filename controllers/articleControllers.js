const createError = require("../utils/error-message");
const newsModel = require("../models/News");
const categoryModel = require("../models/Category");
const userModel = require("../models/User");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

const allArticle = async (req, res, next) => {
  try {
    let articles;
    if (req.role === "admin") {
      articles = await newsModel
        .find()
        .populate("category", "name")
        .populate("author", "fullname");
    } else {
      articles = await newsModel
        .find({ author: req.id })
        .populate("category", "name")
        .populate("author", "fullname");
    }
    res.render("admin/articles", { role: req.role, articles });
  } catch (error) {
    next(error);
  }
};
const addArticlePage = async (req, res, next) => {
  try {
    const categories = await categoryModel.find();
    res.render("admin/articles/create", {
      role: req.role,
      categories,
      errors: 0,
    });
  } catch (error) {
    next(error);
  }
};
const addArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const categories = await categoryModel.find();
    return res.render("admin/articles/create", {
      categories,
      role: req.role,
      errors: errors.array(),
    });
  }
  try {
    const { title, content, category } = req.body;
    const article = new newsModel({
      title,
      content,
      category,
      author: req.id,
      image: req.file.filename,
    });
    await article.save();
    res.redirect("/admin/article");
  } catch (error) {
    next(error);
  }
};
const updateArticlePage = async (req, res, next) => {
  const id = req.params.id;
  try {
    const article = await newsModel
      .findById(id)
      .populate("category", "name")
      .populate("author", "fullname");
    if (!article) {
      return next(createError("Article Not Found", 404));
    }

    if (req.role == "author") {
      if (req.id != article.author._id) {
        return next(createError("Unauthorized", 401));
      }
    }

    const categories = await categoryModel.find();
    res.render("admin/articles/update", {
      role: req.role,
      article,
      categories,
      errors: 0,
    });
  } catch (error) {
    next(error);
  }
};
const updateArticle = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const article = await newsModel
      .findById(id)
      .populate("category", "name")
      .populate("author", "fullname");
    const categories = await categoryModel.find();
    return res.render("admin/articles/update", {
      article,
      categories,
      role: req.role,
      errors: errors.array(),
    });
  }
  try {
    const { title, content, category } = req.body;
    const article = await newsModel.findById(id);
    if (!article) {
      return next(createError("Article Not Found", 404));
    }

    if (req.role == "author") {
      if (req.id != article.author._id) {
        return next(createError("Unauthorized", 401));
      }
    }

    article.title = title;
    article.content = content;
    article.category = category;
    if (req.file) {
      // Delete old image if exists
      const oldImagePath = path.join(
        __dirname,
        "../public/uploads",
        article.image
      );
      fs.unlinkSync(oldImagePath);
      article.image = req.file.filename;
    }
    await article.save();
    res.redirect("/admin/article");
  } catch (error) {
    next(error);
  }
};
const deleteArticle = async (req, res, next) => {
  const id = req.params.id;
  try {
    const article = await newsModel.findById(id);
    if (!article) {
      return next(createError("Article Not Found", 404));
    }
    if (req.role == "author") {
      if (req.id != article.author._id) {
        return next(createError("Unauthorized", 401));
      }
    }
    // Delete image file from server
    try {
      const oldImagePath = path.join(
        __dirname,
        "../public/uploads",
        article.image
      );
      fs.unlinkSync(oldImagePath);
    } catch (error) {
      console.error(error);
    }

    await article.deleteOne();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  allArticle,
  addArticlePage,
  addArticle,
  updateArticlePage,
  updateArticle,
  deleteArticle,
};
