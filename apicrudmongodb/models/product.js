var mongoose = require("mongoose");
var Joi = require("@hapi/joi");
var productsSchema = mongoose.Schema({
  name: String,
  price: Number,
});

//We can validate here too that the coming variables are occurring or not and even there type
//For that we can use Hapijoi but it requires its own mongoose.Schema. So lets create it

//In Hapijoi, we validate by chaining down the methods.

validateProduct = (prod) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
    price: Joi.number().min(0).required(),
    //Then we will validate that data by
  });
  return schema.validate(prod, { abortEarly: false }); //This abortEarly will not end at first error but will take all errors to be seen.
  //This validate will return null if there comes any error and object if all OK.
};

var ProductModel = mongoose.model("product", productsSchema);

module.exports.ProductModel = ProductModel;
module.exports.validate = validateProduct;
