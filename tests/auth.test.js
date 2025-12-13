const request = require("supertest");
const { app, db } = require("../server");

// Utility function for random emails so that there should not be any conflicts duting registration tests
function randomEmail(prefix = "user") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random()*10000)}@test.com`;
}

let normalEmail = randomEmail("normal");
let adminEmail = randomEmail("admin");

describe("Auth APIs", () => {

  it("should register a normal user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: normalEmail,
        password: "123456",
        role: "user",
        isTestUser: true
      });

    expect(res.statusCode).toBe(201);
  });

  it("should register an admin user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email: adminEmail,
        password: "admin123",
        role: "admin",
        isTestUser: true
      });

    expect(res.statusCode).toBe(201);
  });

  it("should login the normal user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: normalEmail,
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should login the admin user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminEmail,
        password: "admin123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});

