const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/new_task", {
      family: 4,
    });
    console.log("connected to DB");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectToDB;
