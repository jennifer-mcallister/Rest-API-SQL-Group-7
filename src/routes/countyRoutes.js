const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const {
    getAllCounties,
    getCountyById,
    createNewCounty,
    updateCountyById,
    deleteCountyById,
} = require("../controllers/countyControllers");

router.get("/", isAuthenticated, getAllCounties);
router.get("/:countyId", isAuthenticated, getCountyById);
router.post("/", isAuthenticated, createNewCounty);
router.put("/:countyId", isAuthenticated, updateCountyById,);
router.delete("/:countyId", isAuthenticated, deleteCountyById);

module.exports = router;