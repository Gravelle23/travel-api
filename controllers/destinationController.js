const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");

const collectionName = "destinations";

// GET all destinations
const getAllDestinations = async (req, res, next) => {
  try {
    const db = getDb();
    const destinations = await db.collection(collectionName).find().toArray();
    res.status(200).json(destinations);
  } catch (err) {
    next(err);
  }
};

// GET destination by ID
const getDestinationById = async (req, res, next) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);

    const destination = await db.collection(collectionName).findOne({ _id: id });

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(destination);
  } catch (err) {
    err.status = 400;
    err.message = "Invalid destination ID format";
    next(err);
  }
};

// POST create destination
const createDestination = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection(collectionName).insertOne(req.body);

    res.status(201).json({
      message: "Destination created",
      id: result.insertedId,
    });
  } catch (err) {
    next(err);
  }
};

// PUT update destination
const updateDestination = async (req, res, next) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);

    const result = await db.collection(collectionName).updateOne(
      { _id: id },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json({ message: "Destination updated" });
  } catch (err) {
    err.status = 400;
    err.message = "Invalid destination ID format";
    next(err);
  }
};

// DELETE destination
const deleteDestination = async (req, res, next) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);

    const result = await db.collection(collectionName).deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json({ message: "Destination deleted" });
  } catch (err) {
    err.status = 400;
    err.message = "Invalid destination ID format";
    next(err);
  }
};

module.exports = {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
