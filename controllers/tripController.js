const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");

const collectionName = "trips";

// get all trips
const getAllTrips = async (req, res, next) => {
  try {
    const db = getDb();
    const trips = await db.collection(collectionName).find().toArray();
    res.status(200).json(trips);
  } catch (err) {
    next(err);
  }
};

// get a single trip by ID
const getTripById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      const error = new Error("Invalid trip ID format");
      error.status = 400;
      throw error;
    }

    const db = getDb();
    const trip = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });

    if (!trip) {
      const error = new Error("Trip not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json(trip);
  } catch (err) {
    next(err);
  }
};

// create new trip
const createTrip = async (req, res, next) => {
  try {
    const db = getDb();
    const { destinationId, ...rest } = req.body;

    if (!ObjectId.isValid(destinationId)) {
      const error = new Error("Invalid destinationId format");
      error.status = 400;
      throw error;
    }

    const newTrip = {
      ...rest,
      destinationId: new ObjectId(destinationId),
    };

    const result = await db.collection(collectionName).insertOne(newTrip);

    const createdTrip = await db
      .collection(collectionName)
      .findOne({ _id: result.insertedId });

    res.status(201).json(createdTrip);
  } catch (err) {
    next(err);
  }
};

// update existing trip
const updateTrip = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      const error = new Error("Invalid trip ID format");
      error.status = 400;
      throw error;
    }

    const db = getDb();
    const { destinationId, ...rest } = req.body;

    if (!ObjectId.isValid(destinationId)) {
      const error = new Error("Invalid destinationId format");
      error.status = 400;
      throw error;
    }

    const updateDoc = {
      ...rest,
      destinationId: new ObjectId(destinationId),
    };

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: "after" }
    );

    if (!result.value) {
      const error = new Error("Trip not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json(result.value);
  } catch (err) {
    next(err);
  }
};

// delete a trip
const deleteTrip = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      const error = new Error("Invalid trip ID format");
      error.status = 400;
      throw error;
    }

    const db = getDb();
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      const error = new Error("Trip not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({ message: "Trip deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
};
