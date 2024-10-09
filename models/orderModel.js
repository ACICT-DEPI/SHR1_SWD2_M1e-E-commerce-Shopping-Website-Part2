const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    shippingAddress1: {
      type: String,
      required: true,
    },
    shippingAddress2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 15,
      match: /^[0-9]{10,15}$/,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Completed", "Cancelled"],
      default: "Pending",
      required: true,
    },
    totalPrice: {
      type: Number,
    },
    totalPriceAfterDiscount: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
