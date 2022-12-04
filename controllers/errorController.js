const AppError = require("../utilis/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = " Duplicate Fields Value : ${value}, Please enter another";
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el = el.message));
  const message = `Invalid input data.${errors}.join(".)`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorPod = (err, res) => {
  //Operational trusted Error Send Message to Client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or other Unknown Error: don't leak error details
  } else {
    //1) log error
    console.error("Error", err);

    //2) Send Generic Message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  //console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (production.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    sendErrorPod(error, res);
  }
};
