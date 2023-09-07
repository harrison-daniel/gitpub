import mongoose from 'mongoose';

let cachedConnection = null;

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

const connectToDatabase = async () => {
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    return Promise.resolve(cachedConnection);
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedConnection = connection;
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return null;
  }
};

export default connectToDatabase;
