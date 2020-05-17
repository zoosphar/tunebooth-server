const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSocialLogin(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.g_id = !isEmpty(data.g_id) ? data.g_id : "";

  if (validator.isEmpty(data.username)) {
    errors.username = "username required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "invalid email";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "email required";
  }

  if (validator.isEmpty(data.g_id)) {
    errors.g_id = "g_id required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
