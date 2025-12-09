const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");

const collectionName = "bookings";

// get all bookings
const getAllBookings = async (req, res, next) => {
  try {
    const db = getDb();
    const bookings = await db.collection(collectionName).find().toArray();
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

// get booking by id
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid booking ID format" });
    }

    const db = getDb();
    const booking = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

// create booking
const createBooking = async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.collection(collectionName).insertOne(req.body);

    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (err) {
    next(err);
  }
};

// update booking
const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid booking ID format" });
    }

    const db = getDb();

    const updateResult = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updatedBooking = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });

    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

// delete booking
const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid booking ID format" });
    }

    const db = getDb();
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
