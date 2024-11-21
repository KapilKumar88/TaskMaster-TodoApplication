const userModel = require("../models/user.model");
const faker = require("faker");
const { hashValue } = require("../helpers/hash.helper");

const userCount = 100;

exports.seedUsers = async () => {
  console.info("Seeding users...");
  for (let index = 0; index < userCount; index++) {
    const hash = await hashValue(faker.internet.password());
    await userModel.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: hash,
      emailVerifiedAt: new Date(),
    });
    console.info("Seeding user", index + 1);
  }
  console.info("Users seeding done...");
};
