const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const reviewRoutes = require("./listRoutes");
const walkingTrailRoutes = require("./todoRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/review", reviewRoutes);
router.use("/walkingtrail", walkingTrailRoutes);

module.exports = router;
