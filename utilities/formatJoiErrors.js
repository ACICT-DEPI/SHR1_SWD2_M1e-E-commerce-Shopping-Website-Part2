const formatJoiErrors = (error) => {
  return error.details.map((err) => ({
    [err.context.key]: {
      message: err.message,
    },
  }));
};

module.exports = formatJoiErrors;
