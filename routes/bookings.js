const router = require("express").Router();
const validate = require("../middleware/validate");
const { bookingSchema } = require("../models/bookingModel");
const controller = require("../controllers/bookingController");

// booking Routes
router.get("/", controller.getAllBookings);
router.get("/:id", controller.getBookingById);
router.post("/", validate(bookingSchema), controller.createBooking);
router.put("/:id", validate(bookingSchema), controller.updateBooking);
router.delete("/:id", controller.deleteBooking);

module.exports = router;
