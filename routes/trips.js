const router = require("express").Router();
const validate = require("../middleware/validate");
const { tripSchema } = require("../models/tripModel");
const controller = require("../controllers/tripController");
const checkJwt = require("../middleware/auth"); 

// Trips Routes
router.get("/", controller.getAllTrips);
router.get("/:id", controller.getTripById);

// Protected routes
router.post("/", checkJwt, validate(tripSchema), controller.createTrip);
router.put("/:id", checkJwt, validate(tripSchema), controller.updateTrip);
router.delete("/:id", checkJwt, controller.deleteTrip);

module.exports = router;
