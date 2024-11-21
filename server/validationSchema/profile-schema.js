const Joi = require("joi");
const { sendResponse } = require("../helpers/requestHandler.helper");

const updateProfileValidation = async (req, res, next) => {
  try {
    console.log(req.body, "req.body", req.files);
    const schema = Joi.object({
      name: Joi.string().max(50).optional().label("Full Name"),
      password: Joi.string().min(8).optional().label("Password"),
      confirm_password: Joi.ref("password"),
      current_password: Joi.string().optional().label("Current Password"),
      email_notification: Joi.boolean().optional(),
      push_notification: Joi.boolean().optional(),
    })
      .with("password", "confirm_password")
      .with("password", "current_password");

    const { value, error } = schema.validate({
      ...req.body,
      ...req.query,
      ...req.params,
    });

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
    console.log(error, ">>>error this side>>>");
    next(error);
  }
};

module.exports = {
  updateProfileValidation,
};
