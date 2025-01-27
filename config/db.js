const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhishek:abhishek123@abhishekasr.wglf63h.mongodb.net/learnX"
  );
};

module.exports = connectDB;
