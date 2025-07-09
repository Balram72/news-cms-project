const express = require("express");
const router = express.Router();

const siteControllers = require("../controllers/siteControllers");
const loadCommonData = require("../middleware/loadCommonData");
router.use(loadCommonData);

router.get("/", siteControllers.index);
router.get("/category/:name", siteControllers.articleByCategories);
router.get("/single/:id", siteControllers.singleArticle);
router.get("/search", siteControllers.search);
router.get("/author/:name", siteControllers.author);
router.post("/single/:id", siteControllers.addComment);

module.exports = router;
