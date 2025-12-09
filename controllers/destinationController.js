const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");

const collectionName = "destinations";

// get all destinations
const getAllDestinations = async (req, res, next) => {
  try {
    const db = getDb();
    const destinations = await db.collection(collectionName).find().toArray();
    res.status(200).json(destinations);
  } catch (err) {
    next(err);
  }
};

// GET single destination by id
const getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid destination ID format" });
    }

    const db = getDb();
    const destination = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(destination);
  } catch (err) {
    next(err);
  }
};

// post create new destination
const createDestination = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection(collectionName).insertOne(req.body);

    const createdDestination = { _id: result.insertedId, ...req.body };
    res.status(201).json(createdDestination);
  } catch (err) {
    next(err);
  }
};

// put update destination
const updateDestination = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid destination ID format" });
    }

    const db = getDb();

    // First, try to update
    const updateResult = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    // If no document matched, return 404
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // Fetch the updated document and return it
    const updatedDestination = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });

    res.status(200).json(updatedDestination);
  } catch (err) {
    next(err);
  }
};

// delete destination
const deleteDestination = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid destination ID format" });
    }

    const db = getDb();
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json({ message: "Destination deleted" });
  } catch (err) {
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
