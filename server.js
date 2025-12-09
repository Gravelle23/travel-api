const express = require("express");
const cors = require("cors");                         
const { initDb } = require("./data/database");
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger/swagger.json");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());                                     
app.use(express.json());

// Swagger 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Root route redirects to Swagger
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// Main API Routes
app.use("/", routes);

// Error Handler 
app.use(errorHandler);

const port = process.env.PORT || 3000;

// Start Server After DB Connects
initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📄 Swagger Docs: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });

  module.exports = app;
