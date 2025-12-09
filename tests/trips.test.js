const request = require("supertest");
const app = require("../app");
const { initDb } = require("../data/database");
const { ObjectId } = require("mongodb");

let sampleTripId;

beforeAll(async () => {
  await initDb();

  const db = require("../data/database").getDb();
  const result = await db.collection("trips").insertOne({
    destinationId: new ObjectId().toString(),
    startDate: "2025-06-01T00:00:00.000Z",
    endDate: "2025-06-10T00:00:00.000Z",
    travelerName: "Test Traveler",
    travelerCount: 2,
    totalCostUSD: 2500,
    notes: "Sample test trip"
  });

  sampleTripId = result.insertedId.toString();
});

describe("Trips API", () => {

  test("GET /api/trips returns 200 and an array", async () => {
    const res = await request(app).get("/api/trips");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/trips/:id returns 200 and a trip", async () => {
    const res = await request(app).get(`/api/trips/${sampleTripId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("travelerName", "Test Traveler");
  });

  test("GET /api/trips/:id with non-existent ID returns 404", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/api/trips/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Trip not found");
  });

  test("GET /api/trips/:id with bad ID returns 400", async () => {
    const res = await request(app).get("/api/trips/not-a-valid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid trip ID format");
  });

});
