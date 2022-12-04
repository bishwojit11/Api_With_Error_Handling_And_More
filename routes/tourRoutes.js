const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/top-5-tours")
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createNewTour);
router
  .route("/:id")
  .get(tourController.getSpecificTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
