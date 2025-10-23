import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  // allow runtime to surface missing envs when actually used
}

type Cache = { client?: MongoClient; clientPromise?: Promise<MongoClient> };

const globalAny = globalThis as unknown as { _mongoClientCache?: Cache };
const cached: Cache = globalAny._mongoClientCache || (globalAny._mongoClientCache = {} as Cache);

if (!cached.clientPromise) {
  if (!process.env.MONGODB_URI) {
    cached.clientPromise = Promise.reject(new Error("MONGODB_URI not defined"));
  } else {
    const client = new MongoClient(process.env.MONGODB_URI);
    cached.clientPromise = client.connect().then(() => {
      cached.client = client;
      return client;
    });
  }
}

export const clientPromise: Promise<MongoClient> = cached.clientPromise as Promise<MongoClient>;

export async function getClient(): Promise<MongoClient> {
  return (await clientPromise) as MongoClient;
}

export default clientPromise;
