const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const reviewRoutes = require("./reviewRoutes");
const walkingTrailRoutes = require("./walkingTrailRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/review", reviewRoutes);
router.use("/walkingtrail", walkingTrailRoutes);

module.exports = router;
