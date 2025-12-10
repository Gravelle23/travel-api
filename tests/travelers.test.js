const request = require("supertest");
const app = require("../app");
const { initDb } = require("../data/database");
const { ObjectId } = require("mongodb");

let sampleTravelerId;

beforeAll(async () => {
  await initDb();

  const db = require("../data/database").getDb();
  const result = await db.collection("travelers").insertOne({
    name: "Test Traveler",
    email: "test.traveler@example.com",
    phone: "+1-555-000-0000",
    preferredLanguage: "English",
    isVIP: false
  });

  sampleTravelerId = result.insertedId.toString();
});

describe("Travelers API", () => {

  test("GET /api/travelers returns 200 and an array", async () => {
    const res = await request(app).get("/api/travelers");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/travelers/:id returns 200 and a traveler", async () => {
    const res = await request(app).get(`/api/travelers/${sampleTravelerId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("name", "Test Traveler");
  });

  test("GET /api/travelers/:id with non-existent ID returns 404", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/api/travelers/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Traveler not found");
  });

  test("GET /api/travelers/:id with bad ID returns 400", async () => {
    const res = await request(app).get("/api/travelers/not-a-valid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid traveler ID format");
  });

});
