const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const reviewRoutes = require("./reviewRoutes");
const walkingTrailRoutes = require("./walkingTrailRoutes");
const countyRoutes = require("./countyRoutes");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/review", reviewRoutes);
router.use("/walkingtrail", walkingTrailRoutes);
router.use("/county", countyRoutes);

module.exports = router;
