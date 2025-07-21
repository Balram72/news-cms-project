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
const isValid = require("../middleware/validation");

//login Routes
router.get("/", userControllers.loginPage);
router.post("/index", isValid.loginValidation, userControllers.adminLogin);
router.get("/logout", isLoggedIn, userControllers.logout);
router.get("/dashboard", isLoggedIn, userControllers.dashboard);
router.get("/settings", isLoggedIn, isAdmin, userControllers.settings);
router.post(
  "/save-settings",
  isLoggedIn,
  isAdmin,
  upload.single("website_logo"),
  userControllers.saveSettings
);
// user CRUD Routes
router.get("/users", isLoggedIn, isAdmin, userControllers.allUser);
router.get("/add-user", isLoggedIn, isAdmin, userControllers.addUserPage);
router.post(
  "/add-user",
  isLoggedIn,
  isAdmin,
  isValid.UserValidation,
  userControllers.addUser
);
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
  isValid.UserUpdateValidation,
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
  isValid.categoryValidation,
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
  isValid.categoryValidation,
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
  isValid.articleValidation,
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
  isValid.articleValidation,
  articleControllers.updateArticle
);
router.delete(
  "/delete-article/:id",
  isLoggedIn,
  articleControllers.deleteArticle
);



// Comment Routes
router.get("/comments", isLoggedIn, CommentControllers.allComments);
router.put(
  "/update-comment-status/:id",
  isLoggedIn,
  CommentControllers.updateCommentStatus
);
router.delete(
  "/delete-comment/:id",
  isLoggedIn,
  CommentControllers.deleteComment
);


//404 Error Middleware
router.use(isLoggedIn, (req, res, next) => {
  res.status(404).render("admin/404", {
    message: "Page Not Found",
    role: req.role,
  });
});

//500 Error Middleware
router.use(isLoggedIn, (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  let view;
  switch (status) {
    case 404:
      view = "admin/404";
      break;
    case 401:
      view = "admin/401";
      break;
    case 500:
      view = "admin/500";
      break;
    default:
      view = "admin/500";
      break;
  }
  res.status(status).render(view, {
    message: err.message || "Something Went Wrong",
    role: req.role,
  });
});

module.exports = router;
