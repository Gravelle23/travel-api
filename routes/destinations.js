const router = require("express").Router();
const validate = require("../middleware/validate");
const { destinationSchema } = require("../models/destinationModel");
const controller = require("../controllers/destinationController");

// Destination Routes
router.get("/", controller.getAllDestinations);
router.get("/:id", controller.getDestinationById);
router.post("/", validate(destinationSchema), controller.createDestination);
router.put("/:id", validate(destinationSchema), controller.updateDestination);
router.delete("/:id", controller.deleteDestination);

module.exports = router;
