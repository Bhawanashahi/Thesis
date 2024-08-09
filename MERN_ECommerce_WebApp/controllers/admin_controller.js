const mongoose = require("mongoose");
require("../models");
const Product = mongoose.model("Products");
const User = mongoose.model("Users");
module.exports = {
  getAdminUsers(req, res) {
    User.find({})
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err =>
        console.log("Error while getting Admin all users ----", err)
      );
  },

  createProduct(req, res) {
    const { name, description, price, picture } = req.body;
    let newProduct = new Product({
      name,
      description,
      price,
      picture
    });
    newProduct.save().then(product => {
      res.status(200).json(product);
    });
  },

  updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, picture } = req.body;
    Product.findById(id)
      .then(product => {
        (product.name = name),
          (product.description = description),
          (product.price = price),
          (product.picture = picture);
      })
      .save()
      .then(product => {
        res.status(200).json(product);
      })
      .catch(err =>
        console.log("error occured while updating product ---- ", err)
      );
  },
  deleteProduct(req, res) {
    const { id } = req.params;
    Product.findOneAndDelete({ _id: id })
      .then(product => {
        res.status(200).json(product);
      })
      .catch(err => {
        console.log("Error occured while deleting a product--- ", err);
      });
  }
};
