const supertest = require("supertest");
const app = require("../app.js");
const faker = require("faker");

describe("Validation tests for the Authentication API's", () => {
  test.each([
    {
      testTitle: '"name" field required validation',
      name: "",
      email: "",
      password: "",
    },
    {
      testTitle: '"name" field max length validation',
      name: faker.lorem.words(50),
      email: "",
      password: "",
    },
    {
      testTitle: '"name" field string validation',
      name: faker.datatype.number(),
      email: "",
      password: "",
    },
    {
      testTitle: '"email" field required validation',
      name: faker.name.findName(),
      email: "",
      password: "",
    },
    {
      testTitle: '"email" field string validation',
      name: faker.name.findName(),
      email: faker.datatype.number(),
      password: "",
    },
    {
      testTitle: '"password" field required validation',
      name: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      password: "",
    },
    {
      testTitle: '"password" field min length validation',
      name: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      password: faker.internet.password(5),
    },
    {
      testTitle: '"confirm_password" field required validation',
      name: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      password: faker.internet.password(8),
    },
    {
      testTitle: '"confirm_password" field mismatch validation',
      name: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      password: faker.internet.password(8),
      confirm_password: faker.internet.password(8),
    },
  ])(`Validation test (Endpoint: /register): $testTitle`, async (params) => {
    const { _testTitle, ...payload } = params; // eslint-disable-line no-unused-vars
    const response = await supertest(app).post("/register").send(payload);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: false,
      }),
      expect.objectContaining({
        statusCode: 422,
      }),
      expect.objectContaining({
        message: "Validations Error",
      }),
      expect.objectContaining({
        data: expect.anything(),
      })
    );
  });

  test.each([
    {
      testTitle: '"email" field required validation',
      email: "",
      password: "",
    },
    {
      testTitle: '"email" field string validation',
      email: faker.datatype.number(),
      password: "",
    },
    {
      testTitle: '"password" field required validation',
      email: faker.internet.exampleEmail(),
      password: "",
    },
  ])(`Validation test (Endpoint: /login): $testTitle`, async (params) => {
    const { _testTitle, ...payload } = params; // eslint-disable-line no-unused-vars
    const response = await supertest(app).post("/login").send(payload);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: false,
      }),
      expect.objectContaining({
        statusCode: 422,
      }),
      expect.objectContaining({
        message: "Validations Error",
      }),
      expect.objectContaining({
        data: expect.anything(),
      })
    );
  });
});

describe('Testing register API (Endpoint: "/register")', () => {
  test("200 test", async () => {
    const pwd = faker.internet.password(8);
    const response = await supertest(app).post("/register").send({
      name: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      password: pwd,
      confirm_password: pwd,
    });

    expect(response.body).toEqual({
      status: true,
      statusCode: 200,
      message: "Registered Successfully",
    });
  });
});

describe('Testing login API (Endpoint: "/login")', () => {
  const email = faker.internet.exampleEmail();
  const pwd = faker.internet.password(8);

  beforeAll(async () => {
    await supertest(app).post("/register").send({
      name: faker.name.findName(),
      email,
      password: pwd,
      confirm_password: pwd,
    });
  });

  test("test for the 401 code", async () => {
    const response = await supertest(app).post("/login").send({
      email: faker.internet.exampleEmail(),
      password: faker.internet.password(),
    });
    expect(response.body).toEqual({
      status: false,
      statusCode: 401,
      message: "Invalid emailId and password",
    });
  });

  test("test for the 200 code", async () => {
    const response = await supertest(app).post("/login").send({
      email,
      password: pwd,
    });

    expect(response.body).toEqual(
      expect.objectContaining({
        status: true,
        statusCode: 200,
        message: "Login Successfully",
        data: {
          token: expect.any(String),
          tokenExpireAt: expect.any(Number),
          refreshTokenExpireAt: expect.any(Number),
          refreshToken: expect.any(String),
        },
      })
    );
  });
});
