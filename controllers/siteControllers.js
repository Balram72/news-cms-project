const mongoose = require("mongoose");

const newsModel = require("../models/News");
const categoryModel = require("../models/Category");
const userModel = require("../models/User");
const commentModel = require("../models/Comment");
const settingModel = require("../models/Setting");
const paginate = require("../utils/paginate");
const createError = require("../utils/error-message");
// const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  const paginatedNews = await paginate(newsModel, {}, req.query, {
    populate: [
      { path: "category", select: "name slug" }, //using the join code
      { path: "author", select: "fullname" }, //using the join code
    ],
    sort: "-createdAt",
  });
  res.render("index", { paginatedNews, query: req.query });
};

exports.articleByCategories = async (req, res, next) => {
  const category = await categoryModel.findOne({ slug: req.params.name });
  if (!category) return next(createError("Category Not Found", 404));
  const paginatedNews = await paginate(
    newsModel,
    { category: category._id },
    req.query,
    {
      populate: [
        { path: "category", select: "name slug" }, //using the join code
        { path: "author", select: "fullname" }, //using the join code
      ],
      sort: "-createdAt",
    }
  );
  res.render("category", { paginatedNews, category, query: req.query });
};

exports.singleArticle = async (req, res, next) => {
  const singleNews = await newsModel
    .findById(req.params.id)
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createdAt: -1 });

  if (!singleNews) return next(createError("Article Not Found", 404));

  const comments = await commentModel
    .find({ article: req.params.id, status: "approved" })
    .sort("-createdAt");

  res.render("single", { singleNews, comments });
};

exports.search = async (req, res, next) => {
  const searchQuery = req.query.search;
  const paginatedNews = await paginate(
    newsModel,
    {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ],
    },
    req.query,
    {
      populate: [
        { path: "category", select: "name slug" }, //using the join code
        { path: "author", select: "fullname" }, //using the join code
      ],
      sort: "-createdAt",
    }
  );
  res.render("search", { paginatedNews, searchQuery, query: req.query });
};
exports.author = async (req, res, next) => {
  const author = await userModel.findOne({ _id: req.params.name });
  if (!author) return next(createError("Author Not Found", 404));

  const paginatedNews = await paginate(
    newsModel,
    {
      author: req.params.name,
    },
    req.query,
    {
      populate: [
        { path: "category", select: "name slug" }, //using the join code
        { path: "author", select: "fullname" }, //using the join code
      ],
      sort: "-createdAt",
    }
  );

  res.render("author", { paginatedNews, author, query: req.query });
};
exports.addComment = async (req, res, next) => {
  try {
    const { name, email, content } = req.body;
    const articleId = await newsModel.findById(req.params.id);
    if (!articleId) return next(createError("article Not Found", 404));
    const comment = new commentModel({
      name: name,
      email: email,
      article: req.params.id,
      content,
    });
    await comment.save();
    res.redirect(`/single/${req.params.id}`);
  } catch (error) {
    return next(createError("Error adding comment", 500));
  }
};
