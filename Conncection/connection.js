const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGODB = process.env.MONGODB;
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    mongoose.connect(MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to Database`);
  } catch (err) {
    console.log(err);
  }
};
module.exports = connect;
