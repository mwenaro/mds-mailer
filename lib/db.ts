import { MongoClient, Db } from 'mongodb';

// Keep a cached client across hot reloads in development
declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/mds-mailer';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const client: MongoClient = new MongoClient(uri);
let clientPromise: Promise<MongoClient> | undefined;

if (process.env.NODE_ENV === 'development') {
  // global cache for dev reloads
  if (!global.__mongoClientPromise) global.__mongoClientPromise = undefined;
}

export async function getDb(): Promise<Db> {
  if (!clientPromise) {
    clientPromise = client.connect();
    if (process.env.NODE_ENV === 'development') {
      global.__mongoClientPromise = clientPromise;
    }
  }
  const c = await clientPromise;
  return c.db();
}
