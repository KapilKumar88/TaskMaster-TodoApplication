const Joi = require("joi");
const crypto = require("crypto");
const moment = require("moment");
const { sendResponse } = require("./requestHandler.helper");
const { DATE_PERIOD } = require("../constants");

/**
 * Validate the Validation schema and add the validated Object to req
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} validationSchema
 * @returns void
 */
exports.validateReqWithSchema = (req, res, next, validationSchema) => {
  const schema = Joi.object(validationSchema);
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
};

// Generate a random token
exports.generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

/**
 * Given a date period (e.g. 'week', 'month', 'year'), return the start and end dates
 * for the current period, as well as the start and end dates for the next and previous
 * periods. The dates are in the ISO 8601 format (YYYY-MM-DD).
 *
 * @param {string} datePeriod Date period (e.g. 'week', 'month', 'year')
 * @returns {Object} Object with the following keys:
 *   currentPeriodStartDate: The start date of the current period
 *   currentPeriodEndDate: The end date of the current period
 *   nextPeriodStartDate: The start date of the next period
 *   nextPeriodEndDate: The end date of the next period
 *   previousPeriodStartDate: The start date of the previous period
 *   previousPeriodEndDate: The end date of the previous period
 * @throws {Error} If the date period is invalid
 */
exports.getDateRangeByPeriod = (datePeriod) => {
  let localDatePeriod = null;
  if (datePeriod === DATE_PERIOD.YEARLY) {
    localDatePeriod = "year";
  }

  if (datePeriod === DATE_PERIOD.MONTHLY) {
    localDatePeriod = "month";
  }

  if (datePeriod === DATE_PERIOD.WEEKLY) {
    localDatePeriod = "week";
  }

  const currentMoment = moment();
  const startDate = currentMoment.clone().startOf(localDatePeriod);
  const endDate = currentMoment.clone().endOf(localDatePeriod);

  if (!startDate.isValid() || !endDate.isValid()) {
    throw new Error(`Invalid date period: ${localDatePeriod}`);
  }

  return {
    currentPeriodStartDate: startDate.toDate(),
    currentPeriodEndDate: endDate.toDate(),
    nextPeriodStartDate: endDate
      .clone()
      .add(1, localDatePeriod)
      .startOf(localDatePeriod)
      .toDate(),
    nextPeriodEndDate: endDate
      .clone()
      .add(1, localDatePeriod)
      .endOf(localDatePeriod)
      .toDate(),
    previousPeriodStartDate: startDate
      .clone()
      .subtract(1, localDatePeriod)
      .startOf(localDatePeriod)
      .toDate(),
    previousPeriodEndDate: startDate
      .clone()
      .subtract(1, localDatePeriod)
      .endOf(localDatePeriod)
      .toDate(),
  };
};

/**
 * Generates a random name for a file.
 * The name is in the format `<timestamp>_<random_string>.<ext>`.
 * The timestamp is the current time in Unix format.
 * The random string is a 10 character long hex string.
 * The extension is the same as the original file.
 * @param {File} file The file to generate a random name for
 * @returns {string} The generated random name
 */
exports.generateRandomNameForFile = (file) => {
  const ext = file.name.split(".").pop();
  console.log(ext, file.name)
  const fileName = `${moment().unix()}_${this.generateRandomToken(10)}.${ext}`;
  return fileName;
};
