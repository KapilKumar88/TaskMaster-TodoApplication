const { sendResponse } = require("../helpers/requestHandler.helper");
const logger = require("../utils/winston.util");

/**
 * Description: This handler is used to handle the exception and return the formatted
 * response with custom messages
 * @param {*} error
 * @param {*} res
 * @returns JSON
 */
exports.exceptionHandler = (error, req, res) => {
  let statusCode, message;
  console.log(error, ">>>>>", error?.name, error?.code);
  switch (error?.code || error?.name) {
    case 11000:
      statusCode = 422;
      message = "Email already exists. Try with different";
      break;
    case "TokenExpiredError":
      statusCode = 401;
      message = "Token expired";
      break;
    case "JsonWebTokenError":
      statusCode = 401;
      message = "Invalid Token";
      break;
    case "PayloadTooLargeError":
      statusCode = 422;
      message = `Uploaded file is too large. Max allowed size is ${error?.limit} bytes.`;
      break;
    case "ERR_OSSL_BAD_DECRYPT":
      statusCode = 400;
      message = `Invalid Token.`;
      break;
    default:
      statusCode = error?.status || 500;
      message = error?.message || "Internal server error.";
      break;
  }

  logger.error(
    `${statusCode} | ${message} | ${req.originalUrl} | ${req.method} | ${req.ip}`
  );

  return sendResponse(res, false, statusCode, message);
};
