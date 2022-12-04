const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModels");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    //for local
    //.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB Connection Successful!");
  });

//read file

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

//import data
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("data successfully loaded");
  } catch (err) {
    console.log(err);
  }
};

//delete all data

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("data successfully deleted!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
