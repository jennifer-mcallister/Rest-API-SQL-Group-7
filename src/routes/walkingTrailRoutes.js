const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  getAllWalkingtrails,
  getWalkingtrailById,
  createNewWalkingtrail,
  updateWalkintrailById,
  deleteWalkingtrailById,
} = require("../controllers/walkingTrailControllers");
// const { createNewReview } = require("../controllers/reviewControllers");

router.get("/", isAuthenticated, getAllWalkingtrails);
router.get("/:walkingtrailId", isAuthenticated, getWalkingtrailById);
router.post("/", isAuthenticated, createNewWalkingtrail);
router.post("/:walkingtrailId/", isAuthenticated, updateWalkintrailById);
router.delete("/:walkingtrailId", isAuthenticated, deleteWalkingtrailById);

module.exports = router;
