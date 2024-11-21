const { TASK_STATUS } = require("../constants");
const { sendResponse } = require("../helpers/requestHandler.helper");
const taskService = require("../services/task.service");

/**
 * Description: Create a task
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON
 */
exports.create = async (req, res, next) => {
  try {
    const result = await taskService.create({
      ...req.validated,
      userId: req.user._id,
    });
    return sendResponse(res, true, 201, "Task created successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * Destails: Update the details of task in DB
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON
 */
exports.update = async (req, res, next) => {
  try {
    const result = await taskService.update(req.validated.id, {
      name: req.validated.name,
      description: req.validated.description,
      status: req.validated.status,
      priority: req.validated.priority,
      completedAt:
        req.validated.status === TASK_STATUS.DONE ? Date.now() : undefined,
    });

    return sendResponse(res, true, 200, "Task updated successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch a list
 * @param {*} _req
 * @param {*} res
 * @param {*} next
 * @returns JSON
 */
exports.list = async (_req, res, next) => {
  try {
    const params = _req.validated;
    let skip = (params.page - 1) * params.limit;

    const filter = {
      userId: _req.user._id,
    };
    if (params?.search) {
      filter["$or"] = [
        { name: { $regex: params.search, $options: "i" } },
        { description: { $regex: params.search, $options: "i" } },
      ];
    }

    if (params.status) {
      filter.status = params.status;
    }

    const allResponse = await Promise.all([
      taskService.countAllTask(filter),
      taskService.fetchAll(filter, skip, params.limit),
    ]);

    return sendResponse(res, true, 200, "Task list fetched successfully", {
      records: allResponse[1],
      totalRecords: allResponse[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a record
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON
 */
exports.delete = async (req, res, next) => {
  try {
    const result = await taskService.deleteById(req.validated.id);
    if (result) {
      return sendResponse(res, true, 200, "Task deleted successfully");
    }

    return sendResponse(
      res,
      false,
      400,
      "Something went wrong or task does not exists."
    );
  } catch (error) {
    next(error);
  }
};
