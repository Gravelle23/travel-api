const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const swaggerJson = require(path.join(__dirname, "swagger", "swagger.json"));


const destinationRoutes = require("./routes/destinations");
const tripRoutes = require("./routes/trips");

const app = express();

app.use(cors());
app.use(express.json());

// swagger Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

// app Routes
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);

module.exports = app;
