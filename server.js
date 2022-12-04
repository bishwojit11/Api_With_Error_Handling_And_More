const mongoose = require("mongoose");
const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception Rejection and Shutting Down...");
  console.log(err.name, err.message);
  Server.close(() => {
    process.exit(1);
  });
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

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

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on("UnhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection and Shutting Down...");
  Server.close(() => {
    process.exit(1);
  });
});
