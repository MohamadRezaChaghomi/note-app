import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Cache connection across hot-reloads in development
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Please create a .env.local with MONGODB_URI.");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}