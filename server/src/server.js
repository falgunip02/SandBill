import mongoose from 'mongoose';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8080;

mongoose.set('debug', true); // Enable Mongoose debugging

(async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    const connection = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(
      "MongoDB connection established and the host is : ",
      connection.connection.host
    );

    // Add error handling for port in use
    const server = app.listen(PORT, () => {
      console.log(
        `Express app is connected to SAND ONE & listening on port ${PORT}`
      );
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}`);
        server.listen(PORT + 1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
})();
