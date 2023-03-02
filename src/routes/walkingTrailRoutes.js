const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  getAllWalkingtrails,
  getWalkingtrailById,
  createNewWalkingtrail,
  deleteWalkingtrailById,
} = require("../controllers/walkingTrailControllers");
const { createNewReview } = require("../controllers/reviewControllers");

router.get("/", getAllWalkingtrails);
router.get("/:walkingtrailId", getWalkingtrailById);

router.post("/", createNewWalkingtrail);
// router.post("/:walkingtrailId/review", isAuthenticated, createNewReview);

router.delete("/:walkingtrailId", deleteWalkingtrailById);

module.exports = router;
