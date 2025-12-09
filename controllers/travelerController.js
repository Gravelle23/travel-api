const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");

const collectionName = "travelers";

// get all travelers
const getAllTravelers = async (req, res, next) => {
  try {
    const db = getDb();
    const travelers = await db.collection(collectionName).find().toArray();
    res.status(200).json(travelers);
  } catch (err) {
    next(err);
  }
};

// get traveler by id
const getTravelerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid traveler ID format" });
    }

    const db = getDb();
    const traveler = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });

    if (!traveler) {
      return res.status(404).json({ message: "Traveler not found" });
    }

    res.status(200).json(traveler);
  } catch (err) {
    next(err);
  }
};

// create traveler
const createTraveler = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection(collectionName).insertOne(req.body);

    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (err) {
    next(err);
  }
};

// update traveler
const updateTraveler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid traveler ID format" });
    }

    const db = getDb();

    const updateResult = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Traveler not found" });
    }

    const updatedTraveler = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });

    res.status(200).json(updatedTraveler);
  } catch (err) {
    next(err);
  }
};

// delete traveler
const deleteTraveler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid traveler ID format" });
    }

    const db = getDb();
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Traveler not found" });
    }

    res.status(200).json({ message: "Traveler deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTravelers,
  getTravelerById,
  createTraveler,
  updateTraveler,
  deleteTraveler,
};
