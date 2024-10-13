const express = require("express");
const { getAllUsers, getUser } = require("../controllers/adminController");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const userRole = require("../utilities/userRoles");

const router = express.Router();

router.get("/", verifyToken, allowedTo(userRole.ADMIN), getAllUsers);

router.get("/:id", verifyToken, allowedTo(userRole.ADMIN), getUser);

module.exports = router;
