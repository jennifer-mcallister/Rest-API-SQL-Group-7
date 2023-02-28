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
router.get("/", getAllReviews);

//GET /api/v1/reviews/:reviewId - Get a review by id
router.get("/:reviewId", getReviewById);

//POST /api/v1/reviews - Create new review
router.post("/", createNewReview);

//PUT /api/v1/reviews/:reviewId - Update review by id
router.put("/:reviewId", updateReviewById);

//DELETE /api/v1/reviews/:reviewId - Delete review by id
router.delete("/:reviewId", deleteReviewById);

module.exports = router;
