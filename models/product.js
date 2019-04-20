const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: String
  },
  productName: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number
  },
  isOnSale: {
    type: Boolean
  },
  category: {
    type: String,
    required: true
  }
});

const Product = mongoose.model("Product", schema);

module.exports = Product;
