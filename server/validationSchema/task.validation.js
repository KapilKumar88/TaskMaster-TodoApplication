const { validateReqWithSchema } = require("../helpers/common.helper");
const Joi = require("joi");
const validateMongooseId = require("./rules/validateMongoObjectId.rule");
const { TASK_PRIORITY_TYPES, TASK_STATUS } = require("../constants");

/**
 * Description: This function validate the payload for create task API
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createTaskValidation = (req, res, next) => {
  try {
    validateReqWithSchema(req, res, next, {
      name: Joi.string().trim().min(3).max(150).required(),
      description: Joi.string().trim().min(3).max(500).optional(),
      status: Joi.string()
        .trim()
        .valid(TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE)
        .optional(),
      priority: Joi.string()
        .trim()
        .valid(
          TASK_PRIORITY_TYPES.LOW,
          TASK_PRIORITY_TYPES.MEDIUM,
          TASK_PRIORITY_TYPES.HIGH
        )
        .optional(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Description: validate the payload for update task API
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updateTaskValidation = (req, res, next) => {
  try {
    validateReqWithSchema(req, res, next, {
      id: Joi.string()
        .trim()
        .required()
        .custom(validateMongooseId)
        .message("InvalidId"),
      name: Joi.string().trim().min(3).max(150).optional(),
      description: Joi.string().trim().min(3).max(500).optional(),
      status: Joi.string()
        .trim()
        .valid(TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE)
        .optional(),
      priority: Joi.string()
        .trim()
        .valid(
          TASK_PRIORITY_TYPES.LOW,
          TASK_PRIORITY_TYPES.MEDIUM,
          TASK_PRIORITY_TYPES.HIGH
        )
        .optional(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Description: Fetch list Validation
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getTaskValidation = (req, res, next) => {
  try {
    validateReqWithSchema(req, res, next, {
      page: Joi.number().integer().required().default(1),
      limit: Joi.number().integer().required().default(10),
      search: Joi.string().trim().optional(),
      status: Joi.string()
        .trim()
        .optional()
        .valid(TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Description: Delete task validation
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deleteTaskValidation = (req, res, next) => {
  try {
    validateReqWithSchema(req, res, next, {
      id: Joi.string()
        .trim()
        .required()
        .custom(validateMongooseId)
        .message("InvalidId"),
    });
  } catch (error) {
    next(error);
  }
};
