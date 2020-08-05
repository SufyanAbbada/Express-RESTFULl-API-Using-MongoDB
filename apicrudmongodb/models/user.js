var mongoose = require("mongoose");
var Joi = require("@hapi/joi");
var bcrypt = require("bcryptjs");
var usersSchema = mongoose.Schema({
  name: String,
  mail: String,
  pass: String,
});

//For Sign-Up
validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
    mail: Joi.string().email().min(5).max(20).required(),
    pass: Joi.string().min(4).max(15).required(),
  });
  return schema.validate(user, { abortEarly: false });
};

usersSchema.methods.generateHashedPasswords = async function () {
  //Now here we cant save the password as it is but encrypt it.
  let salt = await bcrypt.genSalt(10);
  //Now here we will give the variable that is to be encrypted.
  this.pass = await bcrypt.hash(this.pass, salt);
};

//For Signing-In, we don't require name.
validateLogin = (user) => {
  const schema = Joi.object({
    mail: Joi.string().email().min(5).max(20).required(),
    pass: Joi.string().min(4).max(15).required(),
  });
  return schema.validate(user, { abortEarly: false });
};

var UserModel = mongoose.model("user", usersSchema);

module.exports.UserModel = UserModel;
module.exports.validate = validateUser;
module.exports.validateLogin = validateLogin;
