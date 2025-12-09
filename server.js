const app = require("./app");
const { initDb } = require("./data/database");

const port = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📘 Swagger Docs: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
