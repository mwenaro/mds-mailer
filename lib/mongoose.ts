import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  // let runtime error occur when attempting to connect
}

declare global {
  var mongooseCache: { conn?: typeof mongoose | null; promise?: Promise<typeof mongoose> } | undefined;
}

const globalAny = global as unknown as { mongooseCache?: { conn?: typeof mongoose | null; promise?: Promise<typeof mongoose> } };

if (!globalAny.mongooseCache) globalAny.mongooseCache = { conn: null };

export async function connectMongoose() {
  if (globalAny.mongooseCache?.conn) return globalAny.mongooseCache.conn;
  if (!globalAny.mongooseCache?.promise) {
    globalAny.mongooseCache!.promise = mongoose.connect(MONGODB_URI) as Promise<typeof mongoose>;
  }

  globalAny.mongooseCache!.conn = await globalAny.mongooseCache!.promise;
  return globalAny.mongooseCache!.conn;
}

export default connectMongoose;
