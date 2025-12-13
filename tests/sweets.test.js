const request = require("supertest");
const { app, db } = require("../server");

function randomEmail(prefix="user") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random()*10000)}@test.com`;
}

let userEmail = randomEmail("normal");
let adminEmail = randomEmail("admin");

let userToken = "";
let adminToken = "";
let createdSweetId = 0;
let invSweetId = 0;

beforeAll(async () => {
    // register user
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: userEmail,
      password: "123456",
      role: "user",
      isTestUser: true
    });

    // register admin
    await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: adminEmail,
      password: "admin123",
      role: "admin",
      isTestUser: true
    });

    // login user
    const u = await request(app).post("/api/auth/login").send({
      email: userEmail, password: "123456"
    });
    userToken = u.body.token;

    // login admin
    const a = await request(app).post("/api/auth/login").send({
      email: adminEmail, password: "admin123"
    });
    adminToken = a.body.token;
});


// CRUD TESTS
describe("Sweets CRUD Test Suite", () => {

  it("should add a new sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Milk Chocolate",
        category: "Chocolate",
        price: 45,
        quantity: 20
      });

    expect(res.statusCode).toBe(201);
  });

  it("should get list of sweets", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);

    if (res.body.length > 0) {
      createdSweetId = res.body[0].id;
    }
  });

  it("should search sweets", async () => {
    const res = await request(app)
      .get("/api/sweets/search?name=Milk")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("should update sweet", async () => {
    const res = await request(app)
      .put(`/api/sweets/${createdSweetId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Dark Chocolate",
        category: "Chocolate",
        price: 60,
        quantity: 10
      });

    expect(res.statusCode).toBe(200);
  });
});

// INVENTORY TESTS
describe("Inventory APIs", () => {

  beforeAll(async () => {
    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Gummy Bear",
        category: "Candy",
        price: 10,
        quantity: 5
      });

    const list = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);

    invSweetId = list.body[list.body.length - 1].id;
  });

  it("should purchase sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${invSweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("should restock sweet (admin only)", async () => {
    const res = await request(app)
      .post(`/api/sweets/${invSweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 10 });

    expect(res.statusCode).toBe(200);
  });
});

// DELETE LAST
describe("Delete sweet", () => {
  it("admin should delete sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${createdSweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});

// close db
