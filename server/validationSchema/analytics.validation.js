const { validateReqWithSchema } = require("../helpers/common.helper");
const Joi = require("joi");
const { DATE_PERIOD } = require("../constants");

exports.createDatePeriodValidation = (req, res, next) => {
  try {
    validateReqWithSchema(req, res, next, {
      datePeriod: Joi.string()
        .trim()
        .valid(DATE_PERIOD.WEEKLY, DATE_PERIOD.MONTHLY, DATE_PERIOD.YEARLY)
        .optional()
        .default(DATE_PERIOD.WEEKLY),
    });
  } catch (error) {
    next(error);
  }
};
