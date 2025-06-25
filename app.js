const express = require("express");
const app = express();
const mongose = require("mongoose");
const path = require("path");
const experessLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const expressEjsLayouts = require("express-ejs-layouts");
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(experessLayouts);

// view Engine
app.set("view engine", "ejs");

// database connection
mongose.connect(process.env.MONGODB_URI);

//Routes
app.set("layout", "layout");
app.use("/", require("./routes/frontend"));

app.use("/admin", (req, res, next) => {
  res.locals.layout = "admin/layout";
  next();
});

app.use("/admin", require("./routes/admin"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
