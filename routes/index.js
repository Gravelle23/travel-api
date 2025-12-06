const router = require("express").Router();

router.use("/destinations", require("./destinations"));
router.use("/trips", require("./trips"));

module.exports = router;
