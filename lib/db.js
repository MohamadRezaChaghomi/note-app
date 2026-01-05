import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Cache connection across hot-reloads in development
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  console.log("🔌 Connecting to MongoDB...");
  
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set. Please create a .env.local with MONGODB_URI.");
    throw new Error("MONGODB_URI is not set");
  }

  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔄 Creating new MongoDB connection...");
    
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully!");
        console.log("📊 Database:", mongoose.connection.db.databaseName);
        console.log("📈 Connection ready state:", mongoose.connection.readyState);
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);
        console.error("Error details:", error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

// Event listeners for connection status
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
});