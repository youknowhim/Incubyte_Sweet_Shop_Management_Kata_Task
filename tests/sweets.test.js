const request = require("supertest");
const app = require("../server");

let userToken = "";
let adminToken = "";
let createdSweetId = 0;

beforeAll(async () => {

    // login as normal user (already registered from auth tests)
    const u = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "123456" });

    userToken = u.body.token;

    // create admin
    await request(app).post("/api/auth/register").send({
        name: "Admin Person",
        email: "admin@test.com",
        password: "admin123",
        role: "admin"
    });

    const a = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@test.com", password: "admin123" });

    adminToken = a.body.token;
});



describe("Sweets CRUD Test Suite", () => {

    // add sweet
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

    // test get
    it("should get list of sweets", async () => {
        const res = await request(app)
            .get("/api/sweets")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        if(res.body.length > 0){
            createdSweetId = res.body[0].id; // saving 1 sweet id to test update/delete
        }
    });

    // search test
    it("should search sweets by name/category/price", async () => {
        const res = await request(app)
            .get("/api/sweets/search?name=Milk")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
    });

    // update test
    it("should update sweet details", async () => {
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

    // delete sweet (admin only)
    it("should delete sweet when admin calls", async () => {
        const res = await request(app)
            .delete(`/api/sweets/${createdSweetId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
    });

});

describe("Inventory APIs", () => {

  it("should purchase sweet", async () => {
    const res = await request(app)
      .post("/api/sweets/1/purchase")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("should restock sweet (admin)", async () => {
    const res = await request(app)
      .post("/api/sweets/1/restock")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 10 });

    expect(res.statusCode).toBe(200);
  });

});
