const validator = require("validator");
const isEmpty = require("./is-empty");

function postValidation(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.linkUrl = !isEmpty(data.linkUrl) ? data.linkUrl : "";
  data.mediaName = !isEmpty(data.mediaName) ? data.mediaName : "";
  data.mediaType = !isEmpty(data.mediaType) ? data.mediaType : "";
  data.category = !isEmpty(data.category) ? data.category : "";
  data.postType = !isEmpty(data.postType) ? data.postType : "";
  data.pollOptions = !isEmpty(data.pollOptions) ? data.pollOptions : "";
  data.isAttachmentMedia = !isEmpty(data.isAttachmentMedia)
    ? data.isAttachmentMedia
    : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "title required";
  }

  if (validator.isEmpty(data.category)) {
    errors.category = "category required";
  }

  if (validator.isEmpty(data.isAttachmentMedia)) {
    errors.isAttachmentMedia = "isAttachmentMedia required";
  }

  if (data.isAttachmentMedia === "false" && validator.isEmpty(data.linkUrl)) {
    errors.attachment = "link/media required";
  }

  if (validator.isEmpty(data.postType)) {
    errors.postType = "postType is required";
  }

  if (data.postType === "P" && validator.isEmpty(data.pollOptions)) {
    errors.pollOptions = "pollOptions is required for poll";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function getPostValidation(data) {
  let errors = {};

  data.filterTune = !isEmpty(data.filterTune) ? data.filterTune : "";
  data.fetchLimitCount = !isEmpty(data.fetchLimitCount)
    ? data.fetchLimitCount
    : "";

  if (validator.isEmpty(data.filterTune)) {
    errors.filterTune = "filterTune required";
  }
  if (validator.isEmpty(data.fetchLimitCount.toString())) {
    errors.fetchLimitCount = "fetchLimitCount required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function updateFeedbackValidation(data) {
  let errors = {};
  data.feedbackType = !isEmpty(data.feedbackType) ? data.feedbackType : "";
  data.postId = !isEmpty(data.postId) ? data.postId : "";

  if (validator.isEmpty(data.postId)) {
    errors.postId = "postId is required";
  }

  if (validator.isEmpty(data.feedbackType)) {
    errors.feedbackType = "feedbackType required";
  } else {
    if (data.feedbackType === "P") {
      data.choosedOpts = !isEmpty(data.choosedOpts) ? data.choosedOpts : "";
      if (validator.isEmpty(data.choosedOpts)) {
        errors.choosedOpts = "choosedOpts required";
      }
    }
    if (data.feedbackType === "R") {
      data.rating = !isEmpty(data.rating) ? data.rating : "";
      if (validator.isEmpty(data.rating.toString())) {
        errors.rating = "rating required";
      }
    }
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = {
  postValidation,
  getPostValidation,
  updateFeedbackValidation,
};
