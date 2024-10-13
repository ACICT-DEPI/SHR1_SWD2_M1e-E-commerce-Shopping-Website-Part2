const asyncWrapper = require("../middlewares/asyncWrapper");
const checkIfCategoryExists = require("../middlewares/checkIfCategoryExists");
const checkIfIdIsValid = require("../middlewares/checkIfIdIsValid");
const Carousel = require("../models/carouselModel");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../utilities/cloudinaryCloud");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utilities/sendResponse");

const addCarousel = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.body.category)) {
    return sendErrorResponse(res, "Invalid category ID", 404, {
      category: {
        message: "Invalid category ID",
      },
    });
  }

  if (!(await checkIfCategoryExists(req.body.category))) {
    return sendErrorResponse(res, "Category not found", 404, {
      category: {
        message: "Category not found",
      },
    });
  }
  const newCarousel = new Carousel({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    buttonText: req.body.buttonText,
  });
  await newCarousel.save();
  sendSuccessResponse(res, "Carousel saved successfully", 201, newCarousel);
});

const getCarousels = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit
    ? parseInt(query.limit, 10)
    : await Carousel.countDocuments(); // If limit is not provided, use total count
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const totalCarousels = await Carousel.countDocuments();

  const carousels = await Carousel.find({}, { __v: false })
    .populate("category")
    .limit(limit)
    .skip(skip);
  sendSuccessResponse(res, "Carousels fetched successfully", 200, {
    "Total Carousels": totalCarousels,
    carousels,
  });
});

const getCarousel = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid carousel ID", 404, {
      carousel: {
        message: "Invalid carousel ID",
      },
    });
  }

  const carousel = await Carousel.findById(req.params.id).populate("category");
  if (!carousel) {
    return sendErrorResponse(res, "Carousel not found", 404, {
      carousel: {
        message: "Carousel not found",
      },
    });
  }
  sendSuccessResponse(res, "Carousel fetched successfully", 200, carousel);
});

const updateCarousel = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid carousel ID", 404, {
      carousel: {
        message: "Invalid carousel ID",
      },
    });
  }

  const updatedCarousel = await Carousel.findByIdAndUpdate(
    req.params.id,
    {
      $set: { ...req.body },
    },
    { new: true, runValidators: true }
  );
  if (!updatedCarousel) {
    return sendErrorResponse(res, "Carousel not found", 404, {
      carousel: {
        message: "Carousel not found",
      },
    });
  }
  sendSuccessResponse(
    res,
    "Carousel updated successfully",
    200,
    updatedCarousel
  );
});

const carouselPhotoUpload = async (req, res, next) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid carousel ID", 404, {
      carousel: {
        message: "Invalid carousel ID",
      },
    });
  }

  const carousel = await Carousel.findById(req.params.id);
  if (!carousel) {
    return sendErrorResponse(res, "Carousel not found", 404, {
      carousel: {
        message: "Carousel not found",
      },
    });
  }

  try {
    if (!req.file) {
      return sendErrorResponse(res, "No file uploaded", 400, {
        file: {
          message: "No file uploaded",
        },
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    if (carousel.image.public_id !== null) {
      await removeFromCloudinary(carousel.image.public_id);
    }

    const updatedCarousel = await Carousel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          image: {
            url: result.secure_url,
            public_id: result.public_id,
          },
        },
      },
      { new: true }
    );

    sendSuccessResponse(res, "Carousel photo uploaded successfully", 200, {
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCarousel = asyncWrapper(async (req, res) => {
  if (!checkIfIdIsValid(req.params.id)) {
    return sendErrorResponse(res, "Invalid carousel ID", 404, {
      carousel: {
        message: "Invalid carousel ID",
      },
    });
  }

  const carousel = await Carousel.findById(req.params.id);
  if (!carousel) {
    return sendErrorResponse(res, "Carousel not found", 404, {
      carousel: {
        message: "Carousel not found",
      },
    });
  }

  try {
    if (carousel.image.public_id !== null) {
      await removeFromCloudinary(carousel.image.public_id);
    }
  } catch (error) {
    next(error);
  }

  const deletedCarousel = await Carousel.findByIdAndDelete(req.params.id);
  sendSuccessResponse(
    res,
    "Carousel deleted successfully",
    200,
    deletedCarousel
  );
});

module.exports = {
  addCarousel,
  getCarousels,
  getCarousel,
  updateCarousel,
  carouselPhotoUpload,
  deleteCarousel,
};
