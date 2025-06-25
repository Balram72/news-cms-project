const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");
const CommentControllers = require("../controllers/CommentControllers");
const categoryControllers = require("../controllers/categoryControllers");
const articleControllers = require("../controllers/articleControllers");

// Middleware to check if user is logged in
const isLoggedIn = require("../middleware/isLoggedin");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/multer");

//login Routes
router.get("/", userControllers.loginPage);
router.post("/index", userControllers.adminLogin);
router.get("/logout", userControllers.logout);
router.get("/dashboard", isLoggedIn, userControllers.dashboard);
router.get("/settings", isLoggedIn, isAdmin, userControllers.settings);

// user CRUD Routes
router.get("/users", isLoggedIn, isAdmin, userControllers.allUser);
router.get("/add-user", isLoggedIn, isAdmin, userControllers.addUserPage);
router.post("/add-user", isLoggedIn, isAdmin, userControllers.addUser);
router.get(
  "/update-user/:id",
  isLoggedIn,
  isAdmin,
  userControllers.updateUserPage
);
router.post(
  "/update-user/:id",
  isLoggedIn,
  isAdmin,
  userControllers.updateUser
);
router.delete(
  "/delete-user/:id",
  isLoggedIn,
  isAdmin,
  userControllers.deleteUser
);

// Category CRUD Routes
router.get("/category", isLoggedIn, isAdmin, categoryControllers.allCategory);

router.get(
  "/add-category",
  isLoggedIn,
  isAdmin,
  categoryControllers.addCategoryPage
);
router.post(
  "/add-category",
  isLoggedIn,
  isAdmin,
  categoryControllers.addCategory
);
router.get(
  "/update-category/:id",
  isLoggedIn,
  isAdmin,
  categoryControllers.updateCategoryPage
);
router.post(
  "/update-category/:id",
  isLoggedIn,
  isAdmin,
  categoryControllers.updateCategory
);
router.delete(
  "/delete-category/:id",
  isLoggedIn,
  isAdmin,
  categoryControllers.deleteCategory
);

// Article CRUD Routes
router.get("/article", isLoggedIn, articleControllers.allArticle);
router.get("/add-article", isLoggedIn, articleControllers.addArticlePage);
router.post(
  "/add-article",
  isLoggedIn,
  upload.single("image"),
  articleControllers.addArticle
);
router.get(
  "/update-article/:id",
  isLoggedIn,
  articleControllers.updateArticlePage
);
router.post(
  "/update-article/:id",
  isLoggedIn,
  upload.single("image"),
  articleControllers.updateArticle
);
router.delete(
  "/delete-article/:id",
  isLoggedIn,
  articleControllers.deleteArticle
);

// Comment Routes
router.get("/comments", isLoggedIn, CommentControllers.allComments);

module.exports = router;
