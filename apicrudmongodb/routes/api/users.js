const express = require("express");
let router = express.Router();
var { UserModel } = require("../../models/user"); //This is the User Model or Schema.
var {
  uservalidate,
  userloginvalidate,
} = require("../../middleware/uservalidation");

//This is just used to save and encrypt passwords. It has its own syntax.
var bcrypt = require("bcryptjs");

const _ = require("lodash");
//This package is used to perform smaller tasks day to day

const jwt = require("jsonwebtoken");
var config = require("config");

//Now lets create something for sign up. Surely it will be post method.

router.post("/signup", uservalidate, async (req, res) => {
  //In here, simply any user will arrive and just provide name, email and password
  //And in return, we simply will add up it in the record.

  //But we also dont want that, the same email address users, could not be re-declared.
  let check = await UserModel.findOne({ mail: req.body.mail });
  if (check)
    return res
      .status(400)
      .send("User with this Email is Already Existing. Try a new Email.");
  let newuser = new UserModel();
  newuser.name = req.body.name;
  newuser.mail = req.body.mail;
  newuser.pass = req.body.pass;
  await newuser.generateHashedPasswords();

  await newuser.save();
  //Another Problem arrives when we send back the data, it also shows Password, but we dont want it
  //So we will use UNDERSCORE to remove that one.

  return res.send(_.pick(newuser, ["name", "mail"]));
  //This means that it will only pick the two values (mentioned in the []) from the first parameter of pick
});

//Now lets Create some setup of Logging in.
router.post("/login", userloginvalidate, async (req, res) => {
  //Here first we obtain the user from the given email
  let checkuser = await UserModel.findOne({ mail: req.body.mail });
  if (!checkuser)
    return res
      .status(400)
      .send("User with the provided Email Address is not found");
  //Now if it is found, then authenticate Password.
  let validatepass = await bcrypt.compare(req.body.pass, checkuser.pass);
  if (!validatepass)
    return res.status(401).send("Your Entered Password is Incorrect");
  //Now once the user is successfully logged in, we also will provide them with the Toke.
  let token = jwt.sign(
    { _id: checkuser._id, name: checkuser.name },
    config.get("jwtPrivateKey")
  );
  //Now rather than message, we shall return it with a Token.
  res.send(token);
});

module.exports = router;
