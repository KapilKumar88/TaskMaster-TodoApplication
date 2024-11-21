require("dotenv").config();
require("../utils/db-connection.util");
const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");
const { seedUsers } = require("./user.seeder");
const { seedTasksForEachUser } = require("./task.seeder");

// mongo db connection
mongoose.connect(`${dbConfig.DB_CONNECTION}`);
const dbConn = mongoose.connection;
dbConn.on("error", () => {
  console.error("Mongodb connection error");
});
dbConn.once("open", function () {
  console.info(`Mongodb connected successfully | Env: ${process.env.NODE_ENV}`);
});
// end of connection

// start seeding
console.info("Seeding started....");
seedUsers()
  .then(() => {
    return seedTasksForEachUser();
  })
  .then(() => {
    console.info("Seeding done...");
  })
  .catch((error) => console.log(error))
  .finally(() => {
    console.info("Disconnecting from db...");
    mongoose.disconnect();
    process.exit(0);
  });
// end of seeding
