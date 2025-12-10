const request = require("supertest");
const app = require("../app");
const { initDb } = require("../data/database");
const { ObjectId } = require("mongodb");

let sampleBookingId;

beforeAll(async () => {
  await initDb();

  const db = require("../data/database").getDb();
  const result = await db.collection("bookings").insertOne({
    destinationId: new ObjectId().toString(),
    travelerId: new ObjectId().toString(),
    startDate: "2025-07-01T00:00:00.000Z",
    endDate: "2025-07-08T00:00:00.000Z",
    totalPriceUSD: 1500,
    status: "Confirmed",
    notes: "Sample test booking"
  });

  sampleBookingId = result.insertedId.toString();
});

describe("Bookings API", () => {

  test("GET /api/bookings returns 200 and an array", async () => {
    const res = await request(app).get("/api/bookings");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/bookings/:id returns 200 and a booking", async () => {
    const res = await request(app).get(`/api/bookings/${sampleBookingId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("status", "Confirmed");
  });

  test("GET /api/bookings/:id with non-existent ID returns 404", async () => {
    const fakeId = new ObjectId().toString();
    const res = await request(app).get(`/api/bookings/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Booking not found");
  });

  test("GET /api/bookings/:id with bad ID returns 400", async () => {
    const res = await request(app).get("/api/bookings/not-a-valid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid booking ID format");
  });

});
