const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSocialLogin(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.fb_id = !isEmpty(data.fb_id) ? data.fb_id : "";

  if (validator.isEmpty(data.username)) {
    errors.username = "username required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "invalid email";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "email required";
  }

  if (validator.isEmpty(data.fb_id)) {
    errors.fb_id = "fb_id required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
