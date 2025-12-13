const request = require("supertest");
const app = require("../server");

describe("Auth APIs", () => {

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
        role: "user"
      });

    expect(res.statusCode).toBe(201);
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});
