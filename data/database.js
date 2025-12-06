const { MongoClient } = require("mongodb");
require("dotenv").config();

let database;

const initDb = async () => {
  if (database) return database;

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  database = client.db(process.env.DB_NAME);
  console.log("Connected to MongoDB");

  return database;
};

const getDb = () => {
  if (!database) {
    throw new Error("DB not initialized. Call initDb first.");
  }
  return database;
};

module.exports = { initDb, getDb };
