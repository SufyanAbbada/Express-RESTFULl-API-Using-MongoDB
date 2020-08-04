const { validate } = require("../models/product");

productvalidate = (req, res, next) => {
  //Here we use the same logic to validate something.
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //But if there is no error,
  next();
};

module.exports = productvalidate;
