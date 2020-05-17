const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePhoneLogin(data) {
  let errors = {};

  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.p_id = !isEmpty(data.p_id) ? data.p_id : "";

  if (!validator.isMobilePhone(data.phone)) {
    errors.phone = "invalid phone";
  }

  if (validator.isEmpty(data.phone)) {
    errors.phone = "phone required";
  }

  if (validator.isEmpty(data.p_id)) {
    errors.p_id = "p_id required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
