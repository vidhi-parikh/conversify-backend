const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db connected!!");
  } catch (err) {
    console.log("db failed to connect! due to", err);
  }
}

module.exports = connectDB;
