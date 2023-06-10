import { MongoClient, ServerApiVersion, Collection, Db } from "mongodb";

const uri = "mongodb+srv://huynhlb225:2Siyo8ex4ZF04tDi@cluster0.hmzuayv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


export const collections: { races?: Collection, drivers?: Collection } = {}

export async function connectToDatabase() {
  await client.connect();
  const db: Db = client.db('race_results_DB');
  const racesCollection: Collection = db.collection('races');
  collections.races = racesCollection;
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${racesCollection.collectionName}`);
  const driversCollection: Collection = db.collection('drivers');
  collections.drivers = driversCollection;
  console.log(`Successfully connected to collection: ${driversCollection.collectionName}`);
}