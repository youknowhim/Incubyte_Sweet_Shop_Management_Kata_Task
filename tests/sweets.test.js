const request = require("supertest");
const app = require("../server");

let userToken = "";
let adminToken = "";
let createdSweetId = 0;
let invSweetId = 0;

beforeAll(async () => {

    // normal user login
    const u = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "123456" });

    userToken = u.body.token;

    // create admin if not exists
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

    // list sweets
    it("should get list of sweets", async () => {
        const res = await request(app)
            .get("/api/sweets")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);

        if (res.body.length > 0) {
            createdSweetId = res.body[0].id; 
        }
    });

    // search sweets
    it("should search sweets", async () => {
        const res = await request(app)
            .get("/api/sweets/search?name=Milk")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
    });

    // update sweet
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



// INVENTory TESTS
describe("Inventory APIs", () => {

    beforeAll(async () => {
        // create fresh sweet for inventory testing
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

        invSweetId = list.body[list.body.length - 1].id; // last added item
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



// DELETE should be LAST
describe("Delete sweet", () => {
    it("admin should delete sweet", async () => {
        const res = await request(app)
            .delete(`/api/sweets/${createdSweetId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
    });
});
