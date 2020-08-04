const express = require("express");
let router = express.Router();
var mongoose = require("mongoose");
var productvalidate = require("../../middleware/productvalidation");
var { ProductModel } = require("../../models/product");
//Now with this validate, we will apply it on all the requests

//Now this is for creating an API, and it basically will be used to return some data
//Therefore, we will use Get methods and other ways in order to implement it.

//Here down, we dont need to use ./ or file name but due to this router has been declared in the
//app file, so we can just use / to get to the products. And by '/' here, we mean
// 'apicrudmongodb/routes/api/products' and this is saved in the app file and thats why / only will mean that whole
//And it wil fetch data from this file only.

//This route will get all products
router.get("/", async (req, res) => {
  console.log(req.query);
  //Lets show some data elements per page.
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipped = perPage * (page - 1);
  //So lets show the skipped records.
  let productsshow = await ProductModel.find().skip(skipped).limit(perPage);
  //This will show about 10 records on one page and depending upon the page number, it will remove the previous ones and show the next 10
  res.send(productsshow);
});

//Now we shall get a single Product by the given ID with it.
router.get("/:id", async (req, res) => {
  try {
    let singleproduct = await ProductModel.findById(req.params.id);
    //Suppose that the Product was not found but the ID format is correct, then we simply wil return with
    if (!singleproduct)
      return res.status(400).send("Product with the Given ID is not Found");
    return res.send(singleproduct);
  } catch (err) {
    //Simply returning with the message will give the message with 200 means OK
    return res
      .status(400)
      .send("Please Provide a Proper and Valid ID for the Product");
  }
});

//Now lets update some data.
router.put("/:id", productvalidate, async (req, res) => {
  try {
    var singleproduct = await ProductModel.findById(req.params.id);
    if (!singleproduct)
      return res.status(400).send("Product with the Given ID is not Found");
    //First we have fetched the element. Now
    singleproduct.name = req.body.name;
    singleproduct.price = req.body.price;
    await singleproduct.save();
    return res.send(singleproduct);
  } catch (err) {
    return res
      .status(400)
      .send("Please Provide a Proper and Valid ID for the Product");
  }
});

//Now we will delete some record.

router.delete("/:id", async (req, res) => {
  try {
    var singleproduct = await ProductModel.findById(req.params.id);
    if (!singleproduct)
      return res.status(400).send("Product with the Given ID is not Found");
    //First we have fetched the element. Now
    var deletedpro = await ProductModel.findByIdAndDelete(req.params.id);
    //console.log(deletedpro);
    return res.send(deletedpro);
  } catch (err) {
    return res
      .status(400)
      .send("Please Provide a Proper and Valid ID for the Product");
  }
});

//Now we will add some data in the database.
//And by / means we simply will get the request to the main api and don't need any id but require some data
router.post("/", productvalidate, async (req, res) => {
  let newprod = new ProductModel();
  newprod.name = req.body.name;
  newprod.price = req.body.price;
  await newprod.save();
  return res.send(newprod);
});

module.exports = router;
