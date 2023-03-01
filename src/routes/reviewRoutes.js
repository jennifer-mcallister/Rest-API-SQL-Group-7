const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
  getAllReviews,
  getReviewById,
  createNewReview,
  updateReviewById,
  deleteReviewById,
} = require("../controllers/reviewControllers");

//REVIEW

//GET /api/v1/reviews - Get all reviews
router.get("/", isAuthenticated, getAllReviews);

//GET /api/v1/reviews/:reviewId - Get a review by id
router.get("/:reviewId", isAuthenticated, getReviewById);

//POST /api/v1/reviews - Create new review
router.post("/", isAuthenticated, createNewReview);

//PUT /api/v1/reviews/:reviewId - Update review by id
router.put("/:reviewId", isAuthenticated, updateReviewById);

//DELETE /api/v1/reviews/:reviewId - Delete review by id
router.delete("/:reviewId", isAuthenticated, deleteReviewById);

module.exports = router;
