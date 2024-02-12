const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  searchUser,
} = require("../controllers/userControllers");
const authUser = require("../middleware/authentication");

router.post("/sign-up", registerUser);
router.post("/login", loginUser);
router.get("/user", authUser, searchUser);

module.exports = router;
