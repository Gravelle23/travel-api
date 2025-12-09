const request = require("supertest");
const app = require("../app");
const { initDb } = require("../data/database");
const { ObjectId } = require("mongodb");

let sampleId;

beforeAll(async () => {
  await initDb();

  const db = require("../data/database").getDb();
  const result = await db.collection("destinations").insertOne({
    name: "Test Beach",
    country: "USA",
    city: "Miami",
    description: "Test destination",
    rating: 4.5,
    averageCostUSD: 1000,
    bestSeason: "Summer",
    isFamilyFriendly: true
  });

  sampleId = result.insertedId.toString();
});

describe("Destinations API", () => {

  test("GET /api/destinations returns 200 and an array", async () => {
    const res = await request(app).get("/api/destinations");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/destinations/:id returns 200 and a destination", async () => {
    const res = await request(app).get(`/api/destinations/${sampleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("name");
  });

  test("GET /api/destinations/:id with non-existent ID returns 404", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/api/destinations/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Destination not found");
  });

  test("GET /api/destinations/:id with bad ID returns 400", async () => {
    const res = await request(app).get("/api/destinations/not-a-valid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid destination ID format");
  });

});
