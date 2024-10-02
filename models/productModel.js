const mongoose = require("mongoose");
// const ObjectId = mongoose.Types.ObjectId;

// function isValidObjectId(id) {
//   if (ObjectId.isValid(id)) {
//     if (String(new ObjectId(id)) === id) return true;
//     return false;
//   }
//   return false;
// }

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
    },
    excerpt: {
      type: String,
      required: true,
      minlength: 3,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // validate: {
      //   validator: isValidObjectId,
      //   message: "Category must be an valid objectId",
      // },
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    gallery: {
      type: [
        {
          url: {
            type: String,
          },
          public_id: {
            type: String,
          },
        },
      ],
      default: [
        {
          url: "https://cdn.pixabay.com/photo/2016/06/22/11/10/box-1472804_1280.png",
          public_id: null,
        },
      ],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
