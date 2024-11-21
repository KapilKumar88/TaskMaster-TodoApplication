const taskModel = require("../models/task.model");
const userModel = require("../models/user.model");
const { TASK_STATUS, TASK_PRIORITY_TYPES } = require("../constants");
const faker = require("faker");

const taskCount = 100;

exports.seedTasksForEachUser = async () => {
  const user = await userModel.find().select("_id");
  for (const element of user) {
    const tempArr = [];
    console.info("Seeding task for user", element._id);
    for (let index = 0; index < taskCount; index++) {
      tempArr.push(
        taskModel.create({
          name: `Task ${index} ... ${faker.lorem.word(5)}`,
          description: `Task Description ${index} ... ${faker.lorem.sentence()}`,
          status: faker.random.arrayElement([
            TASK_STATUS.TODO,
            TASK_STATUS.IN_PROGRESS,
            TASK_STATUS.DONE,
          ]),
          priority: faker.random.arrayElement([
            TASK_PRIORITY_TYPES.LOW,
            TASK_PRIORITY_TYPES.MEDIUM,
            TASK_PRIORITY_TYPES.HIGH,
          ]),
          userId: element._id,
        })
      );
    }

    await Promise.all(tempArr);
    console.info("Seeding task done for user...");
  }
};
