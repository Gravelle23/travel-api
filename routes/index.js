const router = require("express").Router();

router.use("/destinations", require("./destinations"));
router.use("/trips", require("./trips"));
router.use("/travelers", require("./travelers"));
router.use("/bookings", require("./bookings"));

module.exports = router;
