const formatJoiErrors = (error) => {
  return error.details.reduce((errors, detail) => {
    errors[detail.context.key] = { message: detail.message };
    return errors;
  }, {});
};

module.exports = formatJoiErrors;
