import { Db, MongoClient } from 'mongodb';

let client: MongoClient | undefined;
let database: Db | undefined;

export const connectDatabase = async (): Promise<Db | undefined> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) return undefined;

  client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  database = client.db(process.env.MONGODB_DB_NAME || 'generaticmed');
  return database;
};

export const getDatabase = (): Db | undefined => database;

export const closeDatabase = async (): Promise<void> => {
  await client?.close();
};
