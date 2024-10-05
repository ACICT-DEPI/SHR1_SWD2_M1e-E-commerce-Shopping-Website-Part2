require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { sendErrorResponse } = require("./utilities/sendResponse");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const carouselRoute = require("./routes/carouselRoute");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

app.use(express.json());
const API_URL = process.env.API_URL;
const PORT = process.env.PORT;
const URL = process.env.MONGO_URL;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.use(`${API_URL}/categories`, categoryRoute);
app.use(`${API_URL}/products`, productRoute);
app.use(`${API_URL}/users`, userRoute);
app.use(`${API_URL}/admins`, adminRoute);
app.use(`${API_URL}/carousels`, carouselRoute);

app.all("*", (req, res) => {
  return sendErrorResponse(res, "Resource Not Found", 404);
});

mongoose
  .connect(URL, {
    serverSelectionTimeoutMS: 5000, // Increase the timeout duration
  })
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
