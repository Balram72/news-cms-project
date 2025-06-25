const commentModel = require("../models/Comment");
exports.allComments = async (req, res) => {
  res.render("admin/comments", { role: req.role });
};
