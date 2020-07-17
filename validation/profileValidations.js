const validator = require("validator");
const isEmpty = require("./is-empty");

function tuneUpValidation(data) {
  let errors = {};

  data.tuneFlag = !isEmpty(data.tuneFlag) ? data.tuneFlag : "";
  data.tuneUser = !isEmpty(data.tuneUser) ? data.tuneUser : "";

  if (validator.isEmpty(data.tuneFlag)) {
    errors.tuneFlag = "tuneFlag is required";
  }
  if (validator.isEmpty(data.tuneUser)) {
    errors.tuneUser = "tuneUser is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = {
  tuneUpValidation,
};
