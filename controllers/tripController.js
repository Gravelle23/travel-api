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

// get trip by id
const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid trip ID format" });
    }

    const db = getDb();
    const trip = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (err) {
    next(err);
  }
};

// create trip
const createTrip = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection(collectionName).insertOne(req.body);

    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (err) {
    next(err);
  }
};

// update trip
const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid trip ID format" });
    }

    const db = getDb();

    // First attempt update
    const updateResult = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    // If nothing matched → 404
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Fetch updated doc
    const updatedTrip = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });

    res.status(200).json(updatedTrip);
  } catch (err) {
    next(err);
  }
};

// delete trip
const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid trip ID format" });
    }

    const db = getDb();
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Trip not found" });
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
