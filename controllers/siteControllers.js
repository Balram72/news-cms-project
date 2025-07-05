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
  const news = await newsModel
    .find()
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createAt: -1 });
  const categoryInUse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInUse } });
  // res.json({ news, categories });
  res.render("category", { news, categories });
};
exports.singleArticle = async (req, res) => {
  const news = await newsModel
    .find()
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createAt: -1 });
  const categoryInUse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInUse } });
  // res.json({ news, categories });
  res.render("single");
};
exports.search = async (req, res) => {
  const news = await newsModel
    .find()
    .populate("category", { name: 1, slug: 1 }) // _id: 0 => not show id
    .populate("author", "fullname") // _id: 0 => not show id
    .sort({ createAt: -1 });
  const categoryInUse = await newsModel.distinct("category");
  const categories = await categoryModel.find({ _id: { $in: categoryInUse } });
  // res.json({ news, categories });
  res.render("search");
};
exports.author = async (req, res) => {
  res.render("author");
};
exports.addComment = async (req, res) => {};
