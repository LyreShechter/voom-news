const { MongoClient } = require("mongodb");
const NewsAPI = require("newsapi");

// Very safe and secure code...
const NEWS_API_KEY = "4482b1f1d46a419dbf332d904445e679";
const newsApi = new NewsAPI(NEWS_API_KEY);
const MONGO_CONN_STR =
  "mongodb+srv://shechterlyre:ZsDcBxC29ZmtmefX@voom-app.drala2k.mongodb.net/?retryWrites=true&w=majority";
const MONGO_DB_NAME = "voom-db";
const MONGO_COLLECTION_NAME = "drone-news";

// Get all drone news via newsAPI
async function getAllDroneNews() {
  const PAGE_SIZE = 100;

  // Initial response
  let response = await newsApi.v2.everything({
    q: "drone",
    pageSize: PAGE_SIZE,
  });

  return response.articles;
  // -------- IMPORTANT -------
  // Since I have only the NewsAPI 'free' plan available,
  // I can't request more than 100 results.
  // For that sake, we will treat the first 100 results
  // as they were the entirety of the results.
  // We will return them now, making the rest of
  // the code in this function obsolete.
  // However, I still wrote the "real" implementation
  // of fetching the rest of the results.

  // Fetching all the rest of the articles

  // How much articles found?
  const articleCount = response.totalResults;

  // Calculate total number of pages
  const totalPagesCount = Math.ceil(articleCount / PAGE_SIZE);

  // This array will contain all the results (eventually)
  const newsArticles = [...response.articles];

  // Fetch the rest of the pages (already fetched first page)
  for (let page = 2; page <= totalPagesCount; page++) {
    response = await newsApi.v2.everything({
      q: "drone",
      pageSize: PAGE_SIZE,
      page: page,
    });

    newsArticles.push(...response.articles);
  }

  return newsArticles;
}

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

// Deletes all drone articles and then re-inserts them.
// Not optimal (obviously) but I'm not sure about how to
// implement as an upsert.
async function deleteAndInsertNews() {
  let client = null;
  try {
    // Connect to mongodb
    client = await getClientConn();
    const database = client.db(MONGO_DB_NAME);
    const collection = database.collection(MONGO_COLLECTION_NAME);

    // Delete all news in DB
    const deleted = await collection.deleteMany();
    console.log(`Deleted ${deleted.deletedCount} articles from DB`);

    // Fetch news
    const droneNews = await getAllDroneNews();

    // Insert them to DB
    const inserted = await collection.insertMany(droneNews);
    console.log(`Inserted ${inserted.insertedCount} articles succesfully`);

    // Close DB connection
    await client.close();
  } catch (e) {
    console.error("Error in deleting and inserting news: ", e);
  } finally {
    // Disconnect
    if (client) client.close();
  }
}

async function main() {
  // Run once every 10 minutes
  setInterval(deleteAndInsertNews, 1000 * 60 * 10);
}

main();
