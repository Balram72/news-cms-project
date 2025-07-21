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
router.post("/single/:id/comment", siteControllers.addComment);

router.use((req, res, next) => {
  res.status(404).render("404", {
    message: "Page Not Found",
  });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;

  res.status(status).render("errors", {
    message: err.message || "Something Went Wrong",
    status,
  });
});

module.exports = router;
