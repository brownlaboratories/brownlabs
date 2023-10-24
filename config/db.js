const mongoose = require("mongoose");
require("dotenv").config();

const mongodburi = process.env.MONGOACCESSKEY;

mongoose.connect(mongodburi, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
