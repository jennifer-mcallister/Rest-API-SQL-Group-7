const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  getAllWalkingtrails,
  getWalkingtrailById,
  createNewWalkingtrail,
  updateWalkingtrailById,
  deleteWalkingtrailById,
} = require("../controllers/walkingTrailControllers");

router.get("/", isAuthenticated, getAllWalkingtrails);
router.get("/:walkingtrailId", isAuthenticated, getWalkingtrailById);
router.post("/", isAuthenticated, createNewWalkingtrail);
router.put("/:walkingtrailId", isAuthenticated, updateWalkingtrailById);
router.delete("/:walkingtrailId", isAuthenticated, deleteWalkingtrailById);

module.exports = router;
