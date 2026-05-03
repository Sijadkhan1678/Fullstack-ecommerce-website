const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    stock: {
      type: Number,
      default: 0
    },
    images: [{ type: String, required: true }],
    bottomStyle: {
      type: String,
    },
    colorType: {
      type: String,
      required: true
    },
    dupattaType: {
      type: String,
    },
    liningAttached: {
      type: String,
    },
    noOfPieces: {
      type: String,
      required: true
    },
    season: {
      type: String,
      required: true
    },
    shirtFabric: {
      type: String,
      required: true
    },
    topStyle: {
      type: String,
      required: true
    },
    trouserStyle: {
      type: String,
    },
    additionalDescription: {
      type: String,
      required: true
    },
    disclaimer: {
      type: String,
      required: true
    },
    workTechnique: {
      type: String
    },
    category: {
      primary: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      ancestors: [{
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Category'
        },
        name: String,
        slug: String,
      }]
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;