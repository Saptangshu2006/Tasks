import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/.*@/, '//<credentials>@')}...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`Could not connect to provided MONGODB_URI: ${error.message}`);
      console.log('Falling back to In-Memory MongoDB Server for seamless zero-config development...');
    }
  } else {
    console.log('No MONGODB_URI specified in environment.');
    console.log('Starting In-Memory MongoDB Server for local development...');
  }

  try {
    mongodInstance = await MongoMemoryServer.create();
    const memUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`In-Memory MongoDB Connected: ${conn.connection.host} (${memUri})`);
    console.log('Zero-setup database is ready and active.');
  } catch (memError) {
    console.error(`Failed to start MongoMemoryServer: ${memError.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
