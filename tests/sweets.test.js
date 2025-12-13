const request = require("supertest");
const app = require("../server");

let token = "";

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@example.com", password: "123456" });
  token = res.body.token;
});

describe("Sweets CRUD", () => {

  it("should add a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Candy",
        category: "Chocolate",
        price: 10,
        quantity: 5
      });

    expect(res.statusCode).toBe(201);
  });

  it("should get all sweets", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

});
