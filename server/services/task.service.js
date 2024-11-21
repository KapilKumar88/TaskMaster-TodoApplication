const moment = require("moment");
const { TASK_STATUS, DAY_OF_WEEK_MAP } = require("../constants");
const taskModel = require("../models/task.model");

/**
 * create a record in database
 * @param {name, description, status} params
 * @returns Promise
 */
exports.create = async (params) => {
  return taskModel.create(params);
};

/**
 * Update the recor in database
 * @param id mongoose.Schema.Types.ObjectId
 * @param {name, status, description} params Object
 * @returns Promise
 */
exports.update = async (id, params) => {
  return taskModel.findByIdAndUpdate(id, params, {
    returnDocument: "after",
  });
};

/**
 * find all the record by filter if present
 * @param {page, limit} params Object Optional
 * @returns Promise
 */
exports.fetchAll = async (filter = {}, skip = 0, limit = 0) => {
  return taskModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

/**
 * Delete record by ID
 * @param id mongoose.Schema.Types.ObjectId
 * @returns Promise
 */
exports.deleteById = async (id) => {
  return taskModel.findByIdAndDelete(id);
};

/**
 * Find the record by ID
 * @param id mongoose.Schema.Types.ObjectId
 * @returns Promise
 */
exports.findById = async (id) => {
  return taskModel.findById(id);
};

/**
 * Return the count of tasks in the database
 * @param {Object} filter
 * @return {Promise}
 */
exports.countAllTask = async (filter = {}) => {
  if (
    filter &&
    typeof filter === "object" &&
    Object.keys(filter).length !== 0
  ) {
    return await taskModel.countDocuments(filter);
  }
  return await taskModel.countDocuments();
};

exports.countTotalCompletedTaskOfUserByDateRange = async (
  userId,
  startDate,
  endDate
) => {
  return taskModel.countDocuments({
    userId: userId,
    status: TASK_STATUS.DONE,
    createdAt: { $gte: startDate, $lte: endDate },
  });
};

exports.countTotalCreatedTaskOfUserByDateRange = async (
  userId,
  startDate,
  endDate
) => {
  return taskModel.countDocuments({
    userId: userId,
    createdAt: { $gte: startDate, $lte: endDate },
  });
};

exports.countTotalPendingTaskOfUserByDateRange = async (
  userId,
  startDate,
  endDate
) => {
  return taskModel.countDocuments({
    userId: userId,
    status: TASK_STATUS.TODO,
    createdAt: { $gte: startDate, $lte: endDate },
  });
};

exports.countCompletedTasksForCurrentWeek = async (userId) => {
  const currentWeekStart = moment().startOf("week").toDate();
  const currentWeekEnd = moment().endOf("week").toDate();
  const dayOfWeekMap = [...DAY_OF_WEEK_MAP];

  const result = await taskModel.aggregate([
    {
      $match: {
        userId: userId,
        status: TASK_STATUS.DONE,
        createdAt: {
          $gte: currentWeekStart,
          $lt: currentWeekEnd,
        },
      },
    },
    {
      $group: {
        _id: {
          $dayOfWeek: "$createdAt",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        day: { $arrayElemAt: [dayOfWeekMap, { $subtract: ["$_id", 1] }] },
        count: 1,
      },
    },
  ]);

  // Create an array of 7 days
  const days = dayOfWeekMap.map((day, index) => ({
    name: day,
    count: 0,
  }));

  result.forEach((item) => {
    days[item._id - 1].count = item.count;
  });

  return days;
};

/**
 * Retrieves the number of tasks created and completed by a user within a specified date range,
 * grouped by date.
 * @param {String} userId - The ID of the user.
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Promise<Array>} An array of objects, each containing a date, the number of tasks created,
 * and the number of tasks completed on that date, sorted by date.
 */
exports.completedAndCreatedTaskDataByDateRange = async (
  userId,
  startDate,
  endDate
) => {
  return taskModel.aggregate([
    {
      $match: {
        userId: userId,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        createdTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", null] }, 1, 0],
          },
        },
        completedTasks: {
          $sum: {
            $cond: [{ $ne: ["$status", TASK_STATUS.DONE] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};
