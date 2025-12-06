const express = require("express");
const { initDb } = require("./data/database");
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger/swagger.json");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();

// body parser
app.use(express.json());

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// redirect root to docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// routes
app.use("/", routes);

// error handler 
app.use(errorHandler);

const port = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Swagger: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
