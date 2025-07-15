const commentModel = require("../models/Comment");
const newsModel = require("../models/News");
const createError = require("../utils/error-message");
const { validationResult } = require("express-validator");

exports.allComments = async (req, res, next) => {
  try {
    let comments;
    if (req.role === "admin") {
      comments = await commentModel
        .find()
        .populate("article", "title")
        .sort({ createdAt: -1 });
    } else {
      const news = await newsModel.find({ author: req.id });
      const newsIds = news.map((news) => news._id);
      comments = await commentModel
        .find({ article: { $in: newsIds } })
        .populate("article", "title")
        .sort({ createdAt: -1 });
    }
    res.render("admin/comments", { comments, role: req.role });
  } catch (error) {
    return next(createError("Error Fetching comment", 500));
  }
};
exports.updateCommentStatus = async (req, res, next) => {
  try {
    const comment = await commentModel.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    if (!comment) {
      return next(createError("Comment Not Found", 404));
    }
    res.json({ success: true });
  } catch (error) {
    return next(createError("Error Fetching comment", 500));
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await commentModel.findByIdAndDelete(req.params.id);
    if (!comment) {
      return next(createError("Comment Not Found", 404));
    }
    res.json({ success: true });
  } catch (error) {
    return next(createError("Error Fetching comment", 500));
  }
};
