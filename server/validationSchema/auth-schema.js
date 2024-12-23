const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandler.helper");
const userService = require("../services/user.service");
const { validateReqWithSchema } = require("../helpers/common.helper");
const validateUUID = require("./rules/validateUUID.rule");

const loginValidation = async (req, res, next) => {
  try {
    validateReqWithSchema(req, res, next, {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
  } catch (error) {
    next(error);
  }
};

const registerValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().max(50).required().label("Full Name"),
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().min(8).required().label("Password"),
      confirm_password: Joi.ref("password"),
    }).with("password", "confirm_password");

    const { value, error } = schema.validate(req.body);

    if (error !== undefined) {
      return sendResponse(res, false, 422, "Validations Error", {
        message: error?.details[0]?.message,
        field: error?.details[0]?.context?.key,
      });
    }

    if ((await userService.getCount({ email: value.email })) > 0) {
      return sendResponse(res, false, 422, "Validations Error", {
        message: "Email Id already exists. Please try with different.",
        field: "email",
      });
    }

    // set the variable in the request for validated data
    req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};

const refreshTokenValidation = async (req, res, next) => {
  try {
    validateReqWithSchema(req, res, next, {
      token: Joi.string()
        .required()
        .custom(validateUUID)
        .message("Invalid Token"),
    });
  } catch (error) {
    next(error);
  }
};

const emailVerificationValidation = async (req, res, next) => {
  try {
    validateReqWithSchema(req, res, next, {
      token: Joi.string().required().label("Token"),
    });
  } catch (error) {
    next(error);
  }
};

const emailValidation = async (req, res, next) => {
  try {
    validateReqWithSchema(req, res, next, {
      email: Joi.string().email().required().label("Email"),
    });
  } catch (error) {
    next(error);
  }
};

const resetPasswordValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      token: Joi.string().required().label("Token"),
      new_password: Joi.string().min(8).required().label("New Password"),
      confirm_password: Joi.ref("new_password"),
    }).with("new_password", "confirm_password");

    const { value, error } = schema.validate(req.body);

    if (error !== undefined) {
      return sendResponse(res, false, 422, "Validations Error", {
        message: error?.details[0]?.message,
        field: error?.details[0]?.context?.key,
      });
    }

    // set the variable in the request for validated data
    req.validated = value;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginValidation,
  registerValidation,
  refreshTokenValidation,
  emailValidation,
  emailVerificationValidation,
  resetPasswordValidation,
};
