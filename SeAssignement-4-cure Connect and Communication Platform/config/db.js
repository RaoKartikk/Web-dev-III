const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[database] MongoDB connected');
  } catch (error) {
    console.error('[database] Connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;