const newsModel = require("../models/News");
const categoryModel = require("../models/Category");
const settingModel = require("../models/Setting");
// use the Server Side Cacheing
// cache.set('key',value,time)->Set cache
// cache.get('key')->Get cache
// cache.del('key')->delete cache
// cache.flushAll->get all cache
// cache.keys()->show all cache key name

const NodeCache = require("node-cache");
const cache = new NodeCache();

const loadCommonData = async (req, res, next) => {
  try {
    var latestNews = cache.get("latestNewsCache");
    var categories = cache.get("categoriesCache");
    var setting = cache.get("settingCache");

    if (!latestNews && !categories && !setting) {
      setting = await settingModel.findOne().lean();
      latestNews = await newsModel
        .find()
        .populate("category", { name: 1, slug: 1 })
        .populate("author", "fullname")
        .sort({ createAt: -1 })
        .limit(5)
        .lean(); // useing the java script object

      const categoryInUse = await newsModel.distinct("category");
      categories = await categoryModel
        .find({
          _id: { $in: categoryInUse },
        })
        .lean();

      cache.set("latestNewsCache", latestNews, 60 * 60);
      cache.set("categoriesCache", categories, 3600);
      cache.set("settingCache", setting, 3600);
    }

    res.locals.setting = setting;
    res.locals.latestNews = latestNews;
    res.locals.categories = categories;
    next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = loadCommonData;
