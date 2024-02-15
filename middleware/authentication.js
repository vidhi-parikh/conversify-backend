const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authUser = async (req, res, next) => {
  try {
    let token = req.headers?.authorization;
    if (token) {
      token = token.split(" ")[1];
      let decoded = jwt.verify(token, process.env.JWT_SECERET);
      let isValidUser = await User.find({id: decoded.id});
      if (isValidUser) {
        req.userId = decoded.id;
        next();
      } else res.send("Unauthorized User!");
    } else {
      res.send("Unauthorized User!");
    }
  } catch (err) {
    res.send("Unauthorized User!");
    console.log("Error in authentication middleware",err)
  }
};

module.exports = authUser;
