const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
    },
    price: { type: Number, required: true },
    description: { type: String, trim: true },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],

    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
