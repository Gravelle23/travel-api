const router = require("express").Router();
const validate = require("../middleware/validate");
const { destinationSchema } = require("../models/destinationModel");
const controller = require("../controllers/destinationController");
const checkJwt = require("../middleware/auth"); 

// Destination Routes
router.get("/", controller.getAllDestinations);
router.get("/:id", controller.getDestinationById);

// Protected routes
router.post("/", checkJwt, validate(destinationSchema), controller.createDestination);
router.put("/:id", checkJwt, validate(destinationSchema), controller.updateDestination);
router.delete("/:id", checkJwt, controller.deleteDestination);

module.exports = router;
