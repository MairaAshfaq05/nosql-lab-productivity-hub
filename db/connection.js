const { MongoClient } = require('mongodb');

let client;
let db;

async function connect() {
  if (db) return db;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.DB_NAME || 'productivity_hub';
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log(`✓ Connected to MongoDB at ${uri}, database: ${dbName}`);
  return db;
}

function getDb() {
  if (!db) throw new Error('DB not connected. Call connect() first.');
  return db;
}

module.exports = { connect, getDb };
