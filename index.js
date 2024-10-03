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
app.use(express.json());
const PORT = process.env.PORT;
const URL = process.env.MONGO_URL;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.use("/categories", categoryRoute);

app.use("/products", productRoute);

app.use("/users", userRoute);

app.use("/admins", adminRoute);

app.use("/carousels", carouselRoute);

app.all("*", (req, res) => {
  return sendErrorResponse(res, "Resource Not Found", 404);
});

mongoose
  .connect(URL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
