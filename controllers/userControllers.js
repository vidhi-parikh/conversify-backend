const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const token = require('../utils/generate-token')

const loginUser = async (req, res) => {
  let { email, password } = req.body;

  try {
    // step 1: validate the data
    if (email.length < 1) {
      res.status(404);
      res.send("Please enter email!");
      return;
    }
    if (password.length < 1) {
      res.status(404);
      res.send("Please enter password!");
      return;
    }

    // step 2 : find the user in the db if that email exists
    let user = await User.findOne({ email: email });

    if (!user) {
      res.status(404);
      res.send("Email id not found!");
      return;
    }

    // step 3 : if email id is present then check the password
    let isPasswordMatched = await bcrypt.compare(password, user.password);

    // step 4 : if password is correct then authenicate the user otherwise send the error msg
    if (isPasswordMatched) {

      res.status(200);
      res.json({
          userId: user._id,
          email,
          token: token(user._id),
          msg:"Login Successfull!"
      });
    } else {
      res.status(404);
      res.send("Incorrect Password! Please check it again");
    }
  } catch (err) {
    res.status(404);
    res.send("Something went wrong!");
  }
};

const registerUser = async (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  try {
    if (firstName.length < 1) {
      res.status(404);
      res.send("Please enter first name");
      return;
    }
    if (lastName.length < 1) {
      res.status(404);
      res.send("Please enter last name");
      return;
    }
    if (email.length < 1) {
      res.status(404);
      res.send("Please enter email name");
      return;
    }
    if (password.length < 1) {
      res.status(404);
      res.send("Please enter password name");
      return;
    }

    let isEmailIdExists = await User.findOne({ email: email });

    if (isEmailIdExists) {
      console.log("email already exists", isEmailIdExists);
      res.status(404);
      res.send("Email Id already exists! Create new one.");
      return;
    }

    const userData = new User({
      firstName,
      lastName,
      email,
      password,
    });

    const hash = await bcrypt.hash(password, 10);
    userData.password = hash;

    let data = {
      msg: "Data Saved!",
      token: token(userData._id),
    }

    userData
      .save()
      .then(() => {
        res.status(200);
        res.json(data);
      })
      .catch((err) => {
        res.status(404);
        res.send("Something went wrong!");
      });
  } catch (err) {
    res.status(404);
    res.send("Something went wrong!");
  }
};

const searchUser = async (req, res) => {
  try {
    let searchUser = req.query?.name;
    let users = await User.find({
      $or: [
        { firstName: { $regex: searchUser, $options: "i" } },
        { lastName: { $regex: searchUser, $options: "i" } },
        { email: { $regex: searchUser, $options: "i" } },
      ],
      _id: { $ne: req.userId },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(404).send("Not authorized,token failed");
  }
};

module.exports = {
  registerUser,
  loginUser,
  searchUser,
};
