const express = require("express");
const { MongoClient } = require("mongodb");

const PORT = 5000;
const MONGO_CONN_STR =
  "mongodb+srv://shechterlyre:ZsDcBxC29ZmtmefX@voom-app.drala2k.mongodb.net/?retryWrites=true&w=majority";
const MONGO_DB_NAME = "voom-db";
const MONGO_COLLECTION_NAME = "drone-news";

// Connects to mongodb
async function getClientConn() {
  const client = new MongoClient(MONGO_CONN_STR);
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
    await client.close();
  } finally {
    return client;
  }
}

// Get news from DB
async function getNews(options = {}) {
  let client = null;
  let articles = [];
  try {
    // Connect to mongodb
    client = await getClientConn();
    const database = client.db(MONGO_DB_NAME);
    const collection = database.collection(MONGO_COLLECTION_NAME);

    // Enable keyword filtering (if specified in `options`)
    const queryExpression = options.keywords
      ? {
          $text: { $search: options.keywords },
        }
      : {};

    // Get the articles from the DB
    articles = await collection.find(queryExpression).toArray();
  } catch (e) {
    console.error(`Failed to connect to DB / fetch data from DB`, e);
  } finally {
    // Close the connection
    if (client) await client.close();

    return articles;
  }
}

const app = express();

// Drone news API
app.get("/api/news", (req, res) => {
  async function fetchNews() {
    // Get data with parameters from URL
    const data = await getNews(req.query);
    res.json(data);
  }

  fetchNews();
});

// Listen on port 5000
app.listen(PORT, () => {
  console.log(`Running server on ${PORT}`);
});
