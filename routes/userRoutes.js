const express = require("express");
const userController = require("./../controllers/userController");

const router = express.Router();
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewlUser);
router
  .route("/:id")
  .get(userController.getSpecificUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
