const newsModel = require("../models/News");
const categoryModel = require("../models/Category");
const settingModel = require("../models/Setting");

const loadCommonData = async (req, res, next) => {
  try {
    const setting = await settingModel.findOne();
    const latestNews = await newsModel
      .find()
      .populate("category", { name: 1, slug: 1 })
      .populate("author", "fullname")
      .sort({ createAt: -1 })
      .limit(5);

    const categoryInUse = await newsModel.distinct("category");
    const categories = await categoryModel.find({
      _id: { $in: categoryInUse },
    });
    res.locals.setting = setting;
    res.locals.latestNews = latestNews;
    res.locals.categories = categories;
    next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = loadCommonData;
