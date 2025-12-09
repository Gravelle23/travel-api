const router = require("express").Router();
const validate = require("../middleware/validate");
const { travelerSchema } = require("../models/travelerModel");
const controller = require("../controllers/travelerController");

// traveler Routes
router.get("/", controller.getAllTravelers);
router.get("/:id", controller.getTravelerById);
router.post("/", validate(travelerSchema), controller.createTraveler);
router.put("/:id", validate(travelerSchema), controller.updateTraveler);
router.delete("/:id", controller.deleteTraveler);

module.exports = router;
