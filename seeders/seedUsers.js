const mongoose = require("mongoose");
const { seedUser } = require("./fakeData");
const User = require("../models/userModel");

const URL = process.env.MONGO_URL;
const hello = "hello";

console.log(hello);
