import { MongoClient, ServerApiVersion, Collection, Db } from "mongodb";
import { CONFIG } from "../mongo/env";

const client = new MongoClient(CONFIG.SERVER, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export const collections: {
  races?: Collection,
  drivers?: Collection,
  teams?: Collection
} = {}

export async function connectToDatabase() {
  await client.connect();
  const db: Db = client.db(CONFIG.DB);
  const racesCollection: Collection = db.collection(CONFIG.RACES_COLLECTION);
  collections.races = racesCollection;
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${racesCollection.collectionName}`);
  const driversCollection: Collection = db.collection(CONFIG.DRIVERS_COLLECTION);
  collections.drivers = driversCollection;
  console.log(`Successfully connected to collection: ${driversCollection.collectionName}`);
  const teamsCollection: Collection = db.collection(CONFIG.TEAMS_COLLECTION);
  collections.teams = teamsCollection;
  console.log(`Successfully connected to collection: ${teamsCollection.collectionName}`);
}