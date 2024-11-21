const { TASK_STATUS } = require("../constants");
const taskService = require("./task.service");

/**
 * Returns the total number of tasks for a user within a specified date range.
 * @param {String} userId - The ID of the user.
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Promise<Number>} The count of tasks within the date range.
 */
exports.totalTasksOfUser = async (userId, startDate, endDate) => {
  return taskService.countAllTask({
    userId: userId,
    createdAt: { $gte: startDate, $lte: endDate },
  });
};

exports.totalCompletedTasksOfUser = async (userId, startDate, endDate) => {
  return taskService.countAllTask({
    userId: userId,
    status: TASK_STATUS.DONE,
    createdAt: { $gte: startDate, $lte: endDate },
  });
};

exports.totalPendingTasksOfUser = async (userId, startDate, endDate) => {
  return taskService.countAllTask({
    userId: userId,
    status: TASK_STATUS.TODO,
    createdAt: { $gte: startDate, $lte: endDate },
  });
};

exports.recentTaskList = async (userId) => {
  return taskService.fetchAll({ userId: userId }, 0, 5);
};

exports.taskCompletionChartDataCurrentWeek = async (userId) => {
  return taskService.countCompletedTasksForCurrentWeek(userId);
};
