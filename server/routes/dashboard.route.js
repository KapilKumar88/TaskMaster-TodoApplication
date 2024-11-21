const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated.middleware");
const dashboardController = require("../controller/dashboard.controller");

router.get("/statistics", isAuthenticated, dashboardController.statistics);
router.get(
  "/recent-tasks",
  isAuthenticated,
  dashboardController.recentTaskList
);

router.get(
  "/task-completion-stats",
  isAuthenticated,
  dashboardController.taskCompletionChartData
);

router.get(
  "/upcoming-task",
  isAuthenticated,
  dashboardController.upcomingTaskCalenderData
);

module.exports = router;
