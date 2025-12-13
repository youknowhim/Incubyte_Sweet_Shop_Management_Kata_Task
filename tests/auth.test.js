const request = require("supertest");
const app = require("../server");

describe("Auth APIs", () => {

  it("should register a normal user", async () => {
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


  it("should register an admin user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin"
      });

    expect(res.statusCode).toBe(201);
  });


  it("should login the normal user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });


  it("should login the admin user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@example.com",
        password: "admin123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});
