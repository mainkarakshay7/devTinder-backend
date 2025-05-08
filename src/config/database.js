const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://akshay-ma:namastedev55@namastenode.vizfh.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
