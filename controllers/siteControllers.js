const mongoose = require("mongoose");

const newsModel = require("../models/News");
const categoryModel = require("../models/Category");
const userModel = require("../models/User");
const commentModel = require("../models/Comment");
// const createError = require("../utils/error-message");
// const { validationResult } = require("express-validator");

exports.index = async (req, res) => {
  const news = await newsModel
    .find()
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createAt: -1 });
  const categoryInUse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInUse } });
  // res.json({ news, categories });
  res.render("index", { news, categories });
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
  const categoryInUse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInUse } });
  // res.json({ news, categories });
  res.render("category", { news, categories, category });
};
exports.singleArticle = async (req, res) => {
  const singleNews = await newsModel
    .findById(req.params.id)
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createAt: -1 });
  const categoryInUse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInUse } });
  res.render("single", { singleNews, categories });
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
  const categoryInUse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInUse } });
  res.render("search", { news, categories, searchQuery });
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

  const categoryInUse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInUse } });

  // res.json({ news, categories });
  res.render("author", { news, categories, author });
};
exports.addComment = async (req, res) => {};
