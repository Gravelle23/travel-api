const request = require("supertest");
const { initDb, getDb } = require("../data/database");
const app = require("../server");
const { ObjectId } = require("mongodb");

let db;
let tripId;

beforeAll(async () => {
  db = await initDb();

  const destResult = await db.collection("destinations").insertOne({
    name: "Trip Test Spot",
    country: "USA",
    city: "Miami",
    description: "Trip test",
    rating: 4,
    averageCostUSD: 800,
    bestSeason: "Winter",
    isFamilyFriendly: true,
  });

  const destinationId = destResult.insertedId;

  const tripResult = await db.collection("trips").insertOne({
    destinationId,
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-01-07T00:00:00.000Z",
    travelerName: "Test Traveler",
    travelerCount: 2,
    totalCostUSD: 1500,
    notes: "Test notes",
  });

  tripId = tripResult.insertedId.toString();
});

afterAll(async () => {
  await db.collection("trips").deleteMany({});
  await db.collection("destinations").deleteMany({});
});

test("GET /api/trips returns 200 and an array", async () => {
  const res = await request(app).get("/api/trips");

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test("GET /api/trips/:id returns 200 and a trip", async () => {
  const res = await request(app).get(`/api/trips/${tripId}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("_id");
  expect(res.body).toHaveProperty("travelerName", "Test Traveler");
});

test("GET /api/trips/:id with non-existent id returns 404", async () => {
  const fakeId = new ObjectId().toString();
  const res = await request(app).get(`/api/trips/${fakeId}`);

  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty("message", "Trip not found");
});

test("GET /api/trips/:id with bad id returns 400", async () => {
  const res = await request(app).get("/api/trips/not-a-valid-id");

  expect(res.statusCode).toBe(400);
  expect(res.body).toHaveProperty(
    "message",
    "Invalid trip ID format"
  );
});
