import mongoose, { Connection } from 'mongoose';

let cachedConnection: Connection | null = null;

export async function connectDB(): Promise<Connection> {
  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    const conn = await mongoose.connect(uri);
    cachedConnection = conn.connection;
    console.log('MongoDB Connected');
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
}

export default connectDB;
