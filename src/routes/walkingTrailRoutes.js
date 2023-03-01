const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  getAllWalkingtrails,
  getWalkingtrailById,
  createNewWalkingtrail,
  deleteWalkingtrailById,
} = require("../controllers/walkingtrailController");
const { createNewReview } = require("../controllers/reviewControllers");

router.get("/", isAuthenticated, getAllWalkingtrails);
router.get("/:walkingtrailId", isAuthenticated, getWalkingtrailById);

router.post("/", isAuthenticated, createNewWalkingtrail);
router.post("/:walkingtrailId/review", isAuthenticated, createNewReview);

router.delete("/:walkingtrailId", isAuthenticated, deleteWalkingtrailById);

module.exports = router;
