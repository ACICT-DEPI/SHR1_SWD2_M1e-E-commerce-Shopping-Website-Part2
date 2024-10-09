const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subTotalPrice: {
      type: Number,
    },
    subTotalPriceAfterDiscount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);
