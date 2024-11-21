const authRoute = require("./auth.route");
const taskRoute = require("./task.route");
const dashboardRoute = require("./dashboard.route");
const profileRoute = require("./profile.route");

module.exports = (app) => {
  app.use("/api", authRoute);
  app.use("/api", profileRoute);
  app.use("/api/task", taskRoute);
  app.use("/api/dashboard", dashboardRoute);
};
