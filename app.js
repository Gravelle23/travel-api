const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const swaggerJson = require(path.join(__dirname, "swagger", "swagger.json"));

const destinationRoutes = require("./routes/destinations");
const tripRoutes = require("./routes/trips");

const travelerRoutes = require("./routes/travelers");
const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(cors());
app.use(express.json());

// swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

// app routes 
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/travelers", travelerRoutes);  
app.use("/api/bookings", bookingRoutes);     

// error handler 
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;
