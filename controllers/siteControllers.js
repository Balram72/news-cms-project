const mongoose = require("mongoose");

const newsModel = require("../models/News");
const categoryModel = require("../models/Category");
const userModel = require("../models/User");
const commentModel = require("../models/Comment");
const createError = require("../utils/error-message");
const { validationResult } = require("express-validator");

exports.index = async (req, res) => {
  res.render("index");
};
exports.articleByCategories = async (req, res) => {
  res.render("category");
};
exports.singleArticle = async (req, res) => {
  res.render("single");
};
exports.search = async (req, res) => {
  res.render("search");
};
exports.author = async (req, res) => {
  res.render("author");
};
exports.addComment = async (req, res) => {};
