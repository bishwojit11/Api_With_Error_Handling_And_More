const express = require("express");
const morgan = require("morgan");

const AppError = require("./utilis/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

//1)middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//2) Route Handler

//3)Router
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
