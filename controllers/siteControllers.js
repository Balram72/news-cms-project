const mongoose = require("mongoose");

const newsModel = require("../models/News");
const categoryModel = require("../models/Category");
const userModel = require("../models/User");
const commentModel = require("../models/Comment");
const settingModel = require("../models/Setting");
// const createError = require("../utils/error-message");
// const { validationResult } = require("express-validator");

exports.index = async (req, res) => {
  const news = await newsModel
    .find()
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createAt: -1 });

  res.render("index", { news });
};
exports.articleByCategories = async (req, res) => {
  const category = await categoryModel.findOne({ slug: req.params.name });

  if (!category) {
    return res.status(404).send("category not found");
  }

  const news = await newsModel
    .find({ category: category._id })
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createAt: -1 });
  res.render("category", { news, category });
};
exports.singleArticle = async (req, res) => {
  const singleNews = await newsModel
    .findById(req.params.id)
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createAt: -1 });
  res.render("single", { singleNews });
};
exports.search = async (req, res) => {
  const searchQuery = req.query.search;
  const news = await newsModel
    .find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ],
    })
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createAt: -1 });

  res.render("search", { news, searchQuery });
};
exports.author = async (req, res) => {
  const author = await userModel.findOne({ _id: req.params.name });
  if (!author) {
    return res.status(404).send("Author not found");
  }
  const news = await newsModel
    .find({ author: req.params.name })
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createAt: -1 });
  res.render("author", { news, author });
};
exports.addComment = async (req, res) => {};
