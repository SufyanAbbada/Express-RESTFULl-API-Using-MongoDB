//This middleware is just for checking that the route you are trying to reach, is just for logged-in Users.
const jwt = require("jsonwebtoken");
const config = require("config");
const { UserModel } = require("../models/user");

auth = async (req, res, next) => {
  //And down here, we will check that does our token is coming or not.
  let tokencheck = req.header("x-auth-token");
  if (!tokencheck)
    return res.status(400).send("Token doesnt came with the Request.");
  //Now even we have recived the token with the request, we will now check the authenticity of that Token.
  //It can be done by verifying that token with the private key we have already declared in the config.
  try {
    let user = jwt.verify(tokencheck, config.get("jwtPrivateKey"));
    req.auser = await UserModel.find({ name: user.name });
    //It means that we have got that user and now we also have embedded that user with the request that is coming.
    //So it can be used and shown when required.
  } catch (error) {
    //This try catch is just used becuase if someone plays with the Token, then it will be prompted with error
    res.status(401).send("Invalid Token");
  }

  next();
};

module.exports = auth;

//We just want that the products that are to be changed, must be done by an authenticated User.
