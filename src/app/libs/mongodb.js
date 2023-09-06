import mongoose from 'mongoose';

let cachedConnection = null;

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

const connectToDatabase = async () => {
  // Check if already connected or in the process of connecting
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    return Promise.resolve(cachedConnection);
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // It's generally good to keep this enabled
      // useFindAndModify: false, // Disabling this is usually recommended
    });

    cachedConnection = connection;
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return null;
  }
};

export default connectToDatabase;

//refactored OG
// import mongoose from 'mongoose';

// const connection = { isConnected: false };

// async function connectToDatabase() {
//   if (connection.isConnected) {
//     console.log('Using existing database connection');
//   } else {
//     console.log('Creating new database connection');
//   }

//   try {
//     // Create a new database connection and store it in `connection`
//     const db = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     connection.isConnected = db.connections[0].readyState;
//     console.log('New database connection established');

//     // Handling events to reset the connection state
//     db.connection.on('disconnected', () => {
//       console.log('Database disconnected');
//       connection.isConnected = false;
//     });
//   } catch (error) {
//     console.error('Failed to connect to the database', error);
//     connection.isConnected = false;
//     throw new Error('Failed to connect to the database');
//   }
// }

// export default connectToDatabase;
// export { connection };

// original
// const connectMongoDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default connectMongoDB;
