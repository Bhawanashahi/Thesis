const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  picture: String
});

const productModel = mongoose.model("Products", productSchema);

module.exports = productModel;
