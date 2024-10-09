const asyncWrapper = require("../middlewares/asyncWrapper");
const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utilities/sendResponse");
const checkIfIdIsValid = require("../middlewares/checkIfIdIsValid");
const checkIfProductExists = require("../middlewares/checkIfProductExists");
const checkIfUserExists = require("../middlewares/checkIfUserExists");

const makeOrder = asyncWrapper(async (req, res) => {
  const {
    orderItems,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
  } = req.body;

  const orderItemsIds = orderItems.map(async (orderItem) => {
    if (!checkIfIdIsValid(orderItem.product)) {
      return sendErrorResponse(res, "Invalid product ID", 404, {
        product: {
          message: "Invalid product ID",
        },
      });
    }
    if (!(await checkIfProductExists(orderItem.product))) {
      return sendErrorResponse(res, "Product not found", 404, {
        product: {
          message: "Product not found",
        },
      });
    }
    let newOrderItem = new OrderItem({
      product: orderItem.product,
      quantity: orderItem.quantity,
    });
    newOrderItem = await newOrderItem.save();
    return newOrderItem._id;
  });
  orderItemsIdsResolved = await Promise.all(orderItemsIds);

  let subTotalPrice = 0;
  let totalPrice = 0;
  let subTotalPriceAfterDiscount = 0;
  let totalPriceAfterDiscount = 0;

  for (const orderItemId of orderItemsIdsResolved) {
    const orderItem = await OrderItem.findById(orderItemId).populate(
      "product",
      "price discount" // Assuming the product schema has a 'discount' field
    );

    // Calculate subTotalPrice before discount
    subTotalPrice = orderItem.quantity * orderItem.product.price;
    orderItem.subTotalPrice = subTotalPrice;

    // Calculate subTotalPrice after discount
    const discount = orderItem.product.discount / 100; // Convert discount to percentage
    subTotalPriceAfterDiscount = subTotalPrice * (1 - discount);
    orderItem.subTotalPriceAfterDiscount = subTotalPriceAfterDiscount;

    // Accumulate total prices
    totalPrice += subTotalPrice;
    totalPriceAfterDiscount += subTotalPriceAfterDiscount;

    await orderItem.save();
  }

  if (!checkIfIdIsValid(req.currentUser.id)) {
    return sendErrorResponse(res, "Invalid user ID", 404, {
      user: {
        message: "Invalid user ID",
      },
    });
  }
  if (!(await checkIfUserExists(req.currentUser.id))) {
    return sendErrorResponse(res, "User not found", 404, {
      user: {
        message: "User not found",
      },
    });
  }

  let newOrder = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    user: req.currentUser.id,
    totalPrice,
    totalPriceAfterDiscount,
  });

  newOrder = await newOrder.save();

  if (!newOrder) {
    return sendErrorResponse(res, "Failed to make order", 500, {
      message: "Failed to make order",
    });
  }
  sendSuccessResponse(res, "Order created successfully", 201, newOrder);
});

const getOrders = asyncWrapper(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const query = req.query;
  const limit = query.limit ? parseInt(query.limit, 10) : totalOrders; // If limit is not provided, use total count
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const orders = await Order.find({})
    .populate("user", "firstName lastName")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
  sendSuccessResponse(res, "Orders fetched successfully", 200, {
    "Total Orders": totalOrders,
    orders,
  });
});

const getOrder = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid order ID", 404, {
      order: {
        message: "Invalid order ID",
      },
    });
  }

  const order = await Order.findById(req.params.id)
    .populate("user", "firstName lastName")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    return sendErrorResponse(res, "Order not found", 404, {
      order: {
        message: "Order not found",
      },
    });
  }
  sendSuccessResponse(res, "Order fetched successfully", 200, order);
});

const updateOrder = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid order ID", 404, {
      order: {
        message: "Invalid order ID",
      },
    });
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true, runValidators: true }
  );
  if (!updatedOrder) {
    return sendErrorResponse(res, "Order not found", 404, {
      order: {
        message: "Order not found",
      },
    });
  }
  sendSuccessResponse(res, "Order updated successfully", 200, updatedOrder);
});

const deleteOrder = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid order ID", 404, {
      order: {
        message: "Invalid order ID",
      },
    });
  }

  const deletedOrder = await Order.findByIdAndDelete(req.params.id);
  deletedOrder.orderItems.map(async (orderItem) => {
    await OrderItem.findByIdAndDelete(orderItem);
  });
  if (!deletedOrder) {
    return sendErrorResponse(res, "Order not found", 404, {
      order: {
        message: "Order not found",
      },
    });
  }
  sendSuccessResponse(res, "Order deleted successfully", 200, deletedOrder);
});

module.exports = {
  makeOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
