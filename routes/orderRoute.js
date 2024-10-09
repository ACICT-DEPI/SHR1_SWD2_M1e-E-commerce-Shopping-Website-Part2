const express = require("express");
const {
  makeOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utilities/userRoles");
const {
  validateUpdateOrder,
  validateOrder,
} = require("../middlewares/validateOrder");

const router = express.Router();

router.post("/", verifyToken, validateOrder, makeOrder);

router.get("/", verifyToken, allowedTo(userRoles.ADMIN), getOrders);

router.get("/:id", verifyToken, allowedTo(userRoles.ADMIN), getOrder);

router.patch(
  "/:id",
  verifyToken,
  allowedTo(userRoles.ADMIN),
  validateUpdateOrder,
  updateOrder
);

router.delete("/:id", verifyToken, allowedTo(userRoles.ADMIN), deleteOrder);

module.exports = router;
