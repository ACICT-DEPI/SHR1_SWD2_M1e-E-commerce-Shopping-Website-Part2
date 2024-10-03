const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema(
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
      minlength: 1,
      maxlength: 255,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
    },
    image: {
      type: Object,
      default: {
        url: null,
        public_id: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Carousel", carouselSchema);
