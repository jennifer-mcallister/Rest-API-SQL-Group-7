const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authControllers");
const {
  loginSchema,
  registerSchema,
} = require("../middleware/validation/validationSchemas");
const { validate } = require("../middleware/validation/validationMiddleware");

//POST /api/v1/auth/register
router.post("/register", validate(registerSchema), register);
//POST /api/v1/auth/login
router.post("/login", validate(loginSchema), login);

module.exports = router;
