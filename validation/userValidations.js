const validator = require("validator");
const isEmpty = require("./is-empty");

function validateFacebookLogin(data) {
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
}

function validateGoogleLogin(data) {
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
}

function validatePhoneLogin(data) {
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
}

function validatePhoneRegister(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.p_id = !isEmpty(data.p_id) ? data.p_id : "";

  if (validator.isEmpty(data.username)) {
    errors.username = "username required";
  }

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
}

module.exports = {
  validatePhoneLogin,
  validatePhoneRegister,
  validateGoogleLogin,
  validateFacebookLogin,
};
