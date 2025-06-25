const newsModel = require("../models/News");
const categoryModel = require("../models/Category");
const userModel = require("../models/User");
const fs = require("fs");
const path = require("path");

const allArticle = async (req, res) => {
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
};
const addArticlePage = async (req, res) => {
  const categories = await categoryModel.find();
  res.render("admin/articles/create", { role: req.role, categories });
};
const addArticle = async (req, res) => {
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
    res.status(500).send("Article Not Saved");
  }
};
const updateArticlePage = async (req, res) => {
  const id = req.params.id;
  try {
    const article = await newsModel
      .findById(id)
      .populate("category", "name")
      .populate("author", "fullname");
    if (!article) {
      return res.status(404).send("Article Not Found");
    }

    if (req.role == "author") {
      if (req.id != article.author._id) {
        return res.status(401).send("Unauthorized");
      }
    }

    const categories = await categoryModel.find();
    res.render("admin/articles/update", {
      role: req.role,
      article,
      categories,
    });
  } catch (error) {
    res.status(500).send("Article Not Found");
  }
};
const updateArticle = async (req, res) => {
  const id = req.params.id;
  try {
    const { title, content, category } = req.body;
    const article = await newsModel.findById(id);
    if (!article) {
      return res.status(404).send("Article Not Found");
    }

    if (req.role == "author") {
      if (req.id != article.author._id) {
        return res.status(401).send("Unauthorized");
      }
    }

    article.title = title;
    article.content = content;
    article.category = category;
    if (req.file) {
      // Delete old image if exists
      if (article.image) {
        const oldImagePath = path.join(
          __dirname,
          "../public/uploads",
          article.image
        );
        fs.unlink(oldImagePath, (err) => {
          // Ignore error if file does not exist
        });
      }
      article.image = req.file.filename;
    }
    await article.save();
    res.redirect("/admin/article");
  } catch (error) {
    res.status(500).send("Article Not Updated");
  }
};
const deleteArticle = async (req, res) => {
  const id = req.params.id;
  try {
    const article = await newsModel.findById(id);
    if (!article) {
      return res.status(404).send("Article Not Found");
    }
    if (req.role == "author") {
      if (req.id != article.author._id) {
        return res.status(401).send("Unauthorized");
      }
    }
    // Delete image file from server
    if (article.image) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads",
        article.image
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }
    await article.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).send("Article Not Deleted");
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
