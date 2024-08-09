const mongoose = require("mongoose");
const Product = mongoose.model("Products");

module.exports = {
  readAllProducts(req, res) {
    Product.find({})
      .then(products => {
        res.status(200).json(products);
      })
      .catch(err => {
        console.log("Get all products mongoose error ----- ", err);
      });
  },
  readProduct(req, res) {
    Product.findById(req.params.id)
      .then(product => {
        res.status(200).json(product);
      })
      .catch(err => {
        console.log("error while getting product --- ", err);
      });
  }
};
