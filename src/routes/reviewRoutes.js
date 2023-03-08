const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  getAllReviews,
  getReviewByWalkingtrail,
  getReviewById,
  createNewReview,
  updateReviewById,
  deleteReviewById,
} = require("../controllers/reviewControllers");

//REVIEW

router.get("/", isAuthenticated, getAllReviews);
router.get("/walkingtrail/:walkingtrailName", isAuthenticated, getReviewByWalkingtrail);
router.get("/:reviewId", isAuthenticated, getReviewById);
router.post("/", isAuthenticated, createNewReview);
router.put("/:reviewId", isAuthenticated, updateReviewById);
router.delete("/:reviewId", isAuthenticated, deleteReviewById);

module.exports = router;
