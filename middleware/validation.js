const { body } = require("express-validator");

exports.loginValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^\S+$/)
    .withMessage("UserName must not contain spaces")
    .isLength({ min: 5, max: 12 })
    .withMessage("Username must be 5 to 10 characters long"),

  body("password").trim().notEmpty().withMessage("Password is required"),
  // .isLength({ min: 5, max: 12 })
  // .withMessage("Password must be 5 to 12 characters long"),
];

exports.UserValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("FullName Is Required")
    .isLength({ min: 5, max: 25 })
    .withMessage("FullName must be 5 to 25 character long"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^\S+$/)
    .withMessage("UserName must not contain spaces")
    .isLength({ min: 5, max: 12 })
    .withMessage("Username must be 5 to 10 characters long"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5, max: 12 })
    .withMessage("Password must be 5 to 12 characters long"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "author"])
    .withMessage("Role must be author or admin"),
];
exports.UserUpdateValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("FullName Is Required")
    .isLength({ min: 5, max: 25 })
    .withMessage("FullName must be 5 to 25 character long"),

  body("password")
    .optional({ checkFalsy: true })
    .isLength({ min: 5, max: 12 })
    .withMessage("Password must be 5 to 12 characters long"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "author"])
    .withMessage("Role must be author or admin"),
];

exports.categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category Is Required")
    .isLength({ min: 3, max: 12 })
    .withMessage("Category Name must be 3 to 12 character long"),

  body("description")
    .isLength({ max: 255 })
    .withMessage("Password must be 255 characters long"),
];

exports.articleValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 7, max: 100 })
    .withMessage("Title must be 7 to 100 characters long"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 20 })
    .withMessage("Content must be 20 to 1500 characters long"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  // body("image").custom((value, { req }) => {
  //   if (!req.file) {
  //     throw new Error("Image is Required");
  //   }
  //   const allowedExtensions = [".jpg", ".jpge", ".png"];
  //   const fileExtensions = path.extname(req.file.originalname).toLowerCase();
  //   if (!allowedExtensions.includes(fileExtensions)) {
  //     throw new Error("Invalid image format.Only jpg,jpge,and png are allowed");
  //   }
  //   return true;
  // }),
];
