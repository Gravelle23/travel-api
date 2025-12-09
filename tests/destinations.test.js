const request = require("supertest");
const { initDb, getDb } = require("../data/database");
const app = require("../server");
const { ObjectId } = require("mongodb");

let db;
let destinationId;

beforeAll(async () => {
  db = await initDb();

  const result = await db.collection("destinations").insertOne({
    name: "Test Beach",
    country: "USA",
    city: "San Diego",
    description: "Test destination",
    rating: 4.5,
    averageCostUSD: 1000,
    bestSeason: "Summer",
    isFamilyFriendly: true,
  });

  destinationId = result.insertedId.toString();
});

afterAll(async () => {
  await db.collection("destinations").deleteMany({});
});

test("GET /api/destinations returns 200 and an array", async () => {
  const res = await request(app).get("/api/destinations");

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test("GET /api/destinations/:id returns 200 and a destination", async () => {
  const res = await request(app).get(`/api/destinations/${destinationId}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("_id");
  expect(res.body).toHaveProperty("name", "Test Beach");
});

test("GET /api/destinations/:id with non-existent id returns 404", async () => {
  const fakeId = new ObjectId().toString();
  const res = await request(app).get(`/api/destinations/${fakeId}`);

  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty("message", "Destination not found");
});

test("GET /api/destinations/:id with bad id returns 400", async () => {
  const res = await request(app).get("/api/destinations/not-a-valid-id");

  expect(res.statusCode).toBe(400);
  expect(res.body).toHaveProperty("message", "Invalid destination ID format");
});
