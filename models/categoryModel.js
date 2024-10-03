const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2016/06/22/11/10/box-1472804_1280.png",
        public_id: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
