const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

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
  
        const token = jwt.sign({id : user._id},'1234',{expiresIn:"3h"})
  
        res.status(200);
        res.json({
          success:true,
          data:{
              userId : user._id,
              email,
              token
          }
        })
        res.send("Login Successfull!");
      } else {
        res.status(404);
        res.send("Incorrect Password! Please check it again");
      }
    } catch (err) {
      res.status(404);
      res.send("Something went wrong!");
    }
}

const registerUser =  async (req, res) => {
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
  
      userData
        .save()
        .then(() => {
          res.status(200);
          res.send("Data Saved!");
        })
        .catch((err) => {
          res.status(404);
          res.send("Something went wrong!");
        });
    } catch (err) {
      res.status(404);
      res.send("Something went wrong!");
    }
}

module.exports = {
    registerUser,
    loginUser
}