const express = require("express");
const { userRoles } = require("../constants/users");
const router = express.Router();
const {
  getUserById,
  deleteUserById,
  getAllUsers,
} = require("../controllers/userControllers");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authenticationMiddleware");

router.get("/", isAuthenticated, authorizeRoles(userRoles.ADMIN), getAllUsers); //admin only (who can get all users)
router.get("/:userId", isAuthenticated, getUserById); //authenticated
router.delete("/:userId", isAuthenticated, deleteUserById); //authenticated (user themselves && admin only)

module.exports = router;
