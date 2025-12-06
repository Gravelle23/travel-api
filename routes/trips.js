const router = require("express").Router();
const validate = require("../middleware/validate");
const { tripSchema } = require("../models/tripModel");
const controller = require("../controllers/tripController");

// Trips Routes
router.get("/", controller.getAllTrips);
router.get("/:id", controller.getTripById);
router.post("/", validate(tripSchema), controller.createTrip);
router.put("/:id", validate(tripSchema), controller.updateTrip);
router.delete("/:id", controller.deleteTrip);

module.exports = router;
