const mongoose = require('mongoose');
const connectDB = async (uri = process.env.MONGO_URI) => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected');
};
module.exports = connectDB;
