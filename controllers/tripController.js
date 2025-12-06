const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");

const collectionName = "trips";

// all trips
const getAllTrips = async (req, res, next) => {
  try {
    const db = getDb();
    const trips = await db.collection(collectionName).find().toArray();
    res.status(200).json(trips);
  } catch (err) {
    next(err);
  }
};

// trip by ID
const getTripById = async (req, res, next) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);

    const trip = await db.collection(collectionName).findOne({ _id: id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (err) {
    err.status = 400;
    err.message = "Invalid trip ID format";
    next(err);
  }
};

// create trip
const createTrip = async (req, res, next) => {
  try {
    const db = getDb();

    // Convert destinationId to ObjectId 
    const { destinationId, ...rest } = req.body;

    const tripToInsert = {
      ...rest,
      destinationId: new ObjectId(destinationId),
    };

    const result = await db.collection(collectionName).insertOne(tripToInsert);

    res.status(201).json({
      message: "Trip created",
      id: result.insertedId,
    });
  } catch (err) {
    if (err.name === "BSONTypeError") {
      err.status = 400;
      err.message = "Invalid destinationId format";
    }
    next(err);
  }
};

// update trip
const updateTrip = async (req, res, next) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);

    const updateData = { ...req.body };

    if (updateData.destinationId) {
      updateData.destinationId = new ObjectId(updateData.destinationId);
    }

    const result = await db.collection(collectionName).updateOne(
      { _id: id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip updated" });
  } catch (err) {
    err.status = 400;
    err.message = "Invalid trip ID or destinationId format";
    next(err);
  }
};

// delete trip
const deleteTrip = async (req, res, next) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);

    const result = await db.collection(collectionName).deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip deleted" });
  } catch (err) {
    err.status = 400;
    err.message = "Invalid trip ID format";
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
