const mongoose = require("mongoose");
const MONGODB_URL =
  process.env.MONGODB_URL ||
  "mongodb://localhost:27017/connect_frontend&backend";
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Database is Connected Sucessfully...");
  } catch (error) {
    console.log(`Database cann't be Connected due to some issue ${error}`);
  }
};
module.exports = connectDB;
