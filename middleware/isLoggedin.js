const jwt = require("jsonwebtoken");
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect("/admin");
    const tockenData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = tockenData;
    // console.log(tockenData);
    req.id = tockenData.id;
    req.role = tockenData.role;
    req.fullname = tockenData.fullname;
    next();
  } catch (error) {
    return res.status(401).send("unauthorized :Invalid token");
  }
};

module.exports = isLoggedIn;
