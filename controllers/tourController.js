const Tour = require("./../models/tourModels");
const APIFeatures = require("../utilis/apiFeatures");
const catchAsync = require("./../utilis/catchAsync");
const AppError = require("./../utilis/appError");

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingsAverage,summery,difficulty";
  next();
};

//Read (Get request on api)
exports.getAllTours = catchAsync(async (req, res, next) => {
  //Execute Query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  //send response
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

//Read specific id (Get request to get an specific id)
exports.getSpecificTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError("No tour id found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

//Creat (Post request on api)
exports.createNewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "Success",
    data: { tour: newTour },
  });
});

//Update (Patch request on api)
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError("No tour id found with that ID", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      tour,
    },
  });
});

//delete data
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("No tour id found with that ID", 404));
  }

  res.status(204).json({
    status: "Success",
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
