const TASK_PRIORITY_TYPES = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

const TASK_STATUS = Object.freeze({
  IN_PROGRESS: "in-progress",
  DONE: "done",
  TODO: "todo",
});

const DATE_PERIOD = Object.freeze({
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
});

const DAY_OF_WEEK_MAP = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const USER_TYPE = Object.freeze({
  ADMIN: "admin",
  USER: "user",
});

module.exports = {
  TASK_PRIORITY_TYPES,
  TASK_STATUS,
  DATE_PERIOD,
  DAY_OF_WEEK_MAP,
  USER_TYPE
};
