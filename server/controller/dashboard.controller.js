const moment = require("moment");
const { sendResponse } = require("../helpers/requestHandler.helper");
const dashboardService = require("../services/dashboard.service");

exports.statistics = async (req, res, next) => {
  try {
    const currentWeekStart = moment().startOf("week").toDate();
    const currentWeekEnd = moment().endOf("week").toDate();

    const lastWeekStart = moment()
      .subtract(1, "weeks")
      .startOf("week")
      .toDate();
    const lastWeekEnd = moment().subtract(1, "weeks").endOf("week").toDate();

    const currentWeekTasks = await dashboardService.totalTasksOfUser(
      req.user._id,
      currentWeekStart,
      currentWeekEnd
    );

    const lastWeekTasks = await dashboardService.totalTasksOfUser(
      req.user._id,
      lastWeekStart,
      lastWeekEnd
    );

    const completedTaskCurrentWeek =
      await dashboardService.totalCompletedTasksOfUser(
        req.user._id,
        currentWeekStart,
        currentWeekEnd
      );
    const completedTaskLastWeek =
      await dashboardService.totalCompletedTasksOfUser(
        req.user._id,
        lastWeekStart,
        lastWeekEnd
      );

    const pendingTaskCurrentWeek =
      await dashboardService.totalPendingTasksOfUser(
        req.user._id,
        currentWeekStart,
        currentWeekEnd
      );
    const pendingTaskLastWeek = await dashboardService.totalPendingTasksOfUser(
      req.user._id,
      lastWeekStart,
      lastWeekEnd
    );

    const completionRate = (
      (completedTaskCurrentWeek / currentWeekTasks) *
      100
    ).toFixed(2);
    const previousWeekCompletionRate = (
      (completedTaskLastWeek / lastWeekTasks) *
      100
    ).toFixed(2);

    const result = {
      totalTask: {
        count: currentWeekTasks,
        diffFromLastWeek: currentWeekTasks - lastWeekTasks,
      },
      completedTask: {
        count: completedTaskCurrentWeek,
        diffFromLastWeek: completedTaskCurrentWeek - completedTaskLastWeek,
      },
      pendingTask: {
        count: pendingTaskCurrentWeek,
        diffFromLastWeek: pendingTaskCurrentWeek - pendingTaskLastWeek,
      },
      completionRate: {
        count: completionRate,
        diffFromLastWeek: completionRate - previousWeekCompletionRate,
      },
    };

    return sendResponse(res, true, 200, "Success", result);
  } catch (error) {
    next(error);
  }
};

exports.recentTaskList = async (req, res, next) => {
  try {
    const result = await dashboardService.recentTaskList(req.user._id);
    return sendResponse(res, true, 200, "Success", result);
  } catch (error) {
    next(error);
  }
};

exports.taskCompletionChartData = async (req, res, next) => {
  try {
    const result = await dashboardService.taskCompletionChartDataCurrentWeek(
      req.user._id
    );
    return sendResponse(res, true, 200, "Success", result);
  } catch (error) {
    next(error);
  }
};

exports.upcomingTaskCalenderData = async (req, res, next) => {
  try {
    const result = await dashboardService.upcomingTaskData(req.user._id);
    return sendResponse(res, true, 200, "Success", result);
  } catch (error) {
    next(error);
  }
};
