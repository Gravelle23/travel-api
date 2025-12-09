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

// get destination by ID
const getDestinationById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      const error = new Error("Invalid destination ID format");
      error.status = 400;
      throw error;
    }

    const db = getDb();
    const destination = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });

    if (!destination) {
      const error = new Error("Destination not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json(destination);
  } catch (err) {
    next(err);
  }
};

// create a new destination 
const createDestination = async (req, res, next) => {
  try {
    const db = getDb();

    const result = await db.collection(collectionName).insertOne(req.body);

    const createdDestination = await db
      .collection(collectionName)
      .findOne({ _id: result.insertedId });

    res.status(201).json(createdDestination);
  } catch (err) {
    next(err);
  }
};

// updating existing destination
const updateDestination = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      const error = new Error("Invalid destination ID format");
      error.status = 400;
      throw error;
    }

    const db = getDb();

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: "after" }
    );

    if (!result.value) {
      const error = new Error("Destination not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json(result.value);
  } catch (err) {
    next(err);
  }
};

// delete a destination
const deleteDestination = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      const error = new Error("Invalid destination ID format");
      error.status = 400;
      throw error;
    }

    const db = getDb();
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      const error = new Error("Destination not found");
      error.status = 404;
      throw error;
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
